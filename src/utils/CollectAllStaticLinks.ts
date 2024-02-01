import { StaticLinksResult } from '../interface';
const CollectAllStaticLinks = async (document: Document | null | undefined): Promise<StaticLinksResult> => {
	const result: StaticLinksResult = { data: [], src: [], count: 0 };
	if (!document) return result;

	const protocol = window?.location?.protocol ?? '';
	const imagesFilesSrc: string[] = [];
	const cssURLRegex = /(?<=url\()['"]?([^")]+)/g;

	const ALLOWED_IMAGE_EXTENSION = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'svg', 'bmp', 'ico', 'tiff'];
	const MAX_DEPTH = 4;

	const CheckAbsolutePath = (url: string): string => {
		if (url.startsWith('//')) url = protocol + url;
		return url;
	};

	const isHttpUrl = (url: string): boolean => {
		return url.startsWith('//') || url.startsWith('http') || url.startsWith('https');
	};

	const IsNotValidImageData = (el: HTMLImageElement): boolean => {
		if (el.nodeName === 'img') {
			const isLessThatMin = el.naturalWidth < 10 || el.naturalHeight < 10;
			const isZeroSize = el.naturalWidth === 0 || el.naturalHeight === 0;
			return isLessThatMin || isZeroSize || imagesFilesSrc.includes(el.src);
		}
		return imagesFilesSrc.includes(el.src);
	};

	const ValidateExtension = (src: string): boolean => {
		const extension = src
			.split(/\.([^\./\?\#]+)($|\?|\#)/g)?.[1]
			?.trim()
			?.toLowerCase();
		if (extension) {
			return ALLOWED_IMAGE_EXTENSION.includes(extension);
		}
		return true;
	};

	function ProcessCssStyles(source: HTMLElement | CSSRule | string, result: StaticLinksResult): StaticLinksResult {
		let cssRuleImages: string[] = [];
		if ((source as HTMLElement).tagName) {
			const style = (source as HTMLElement).style;
			const backgroundImageMatch: string[] = style.background.match(cssURLRegex) ?? [];
			const backgroundMatch: string[] = style.backgroundImage.match(cssURLRegex) ?? [];
			cssRuleImages = cssRuleImages.concat(backgroundImageMatch, backgroundMatch);
		} else if ((source as CSSStyleRule)?.cssText) {
			const style = (source as CSSStyleRule).style;

			const backgroundImageMatch = style?.backgroundImage?.match(cssURLRegex) ?? [];
			const backgroundMatch = style?.background?.match(cssURLRegex) ?? [];
			cssRuleImages = cssRuleImages.concat(backgroundImageMatch, backgroundMatch);
		} else if (typeof source === 'string') {
			cssRuleImages = source.match(cssURLRegex) ?? [];
		}

		if (cssRuleImages.length === 0) return result;
		for (let j = 0; j < cssRuleImages.length; j++) {
			const currentURL = cssRuleImages[j];

			if (currentURL.startsWith('url') || imagesFilesSrc.includes(currentURL)) continue;
			if (!ValidateExtension(currentURL)) continue;
			imagesFilesSrc.push(currentURL);

			if (currentURL.startsWith('data:')) {
				result.data.push({
					type: 'data',
					src: currentURL,
					alt: '',
					width: 0,
					height: 0,
				});
			} else if (isHttpUrl(currentURL)) {
				result.src.push({
					type: 'src',
					src: CheckAbsolutePath(currentURL),
					alt: '',
					width: 0,
					height: 0,
				});
			}
		}
		return result;
	}

	async function ProcessElement(el: HTMLElement | Document, result: StaticLinksResult, depth: number): Promise<StaticLinksResult> {
		if (depth === MAX_DEPTH) return result;

		const CollectFromCSSBackground = async () => {
			const styleSheets = el.nodeType === el.DOCUMENT_NODE ? (el as Document).styleSheets : (el as Element).ownerDocument.styleSheets;
			if (styleSheets.length === 0) return;
			for (let i = 0; i < styleSheets.length; i++) {
				try {
					(styleSheets[i] as any).crossorigin = 'anonymous';
					const rules = styleSheets[i].cssRules as unknown as CSSStyleRule[];
					for (let i = 0; i < rules.length; i++) {
						ProcessCssStyles(rules[i], result);
					}
				} catch {
					const s = styleSheets[i];
					if (s.href) {
						const text = await (await fetch(s.href)).text();
						ProcessCssStyles(text, result);
					}
				}
			}
		};

		const CollectFromSrc = () => {
			const elements = el.querySelectorAll('[src]');
			for (let i = 0; i < elements.length; i++) {
				const el = elements[i] as HTMLImageElement;
				if (IsNotValidImageData(el as any)) continue;
				if (!ValidateExtension(el.src)) continue;

				imagesFilesSrc.push(el.src);
				if (el.src.startsWith('data:')) {
					result.data.push({
						type: 'data',
						src: el.src,
						alt: '',
						width: 0,
						height: 0,
					});
				} else {
					result.src.push({
						type: 'src',
						src: CheckAbsolutePath(el.src),
						alt: el.alt,
						width: el.naturalWidth,
						height: el.naturalHeight,
					});
				}
			}
		};

		const CollectFromSVGS = () => {
			const svgs = el.querySelectorAll('svg');
			for (let i = 0; i < svgs.length; i++) {
				const serializedSVG = new XMLSerializer().serializeToString(svgs[i]);
				const dataURL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(serializedSVG)));

				if (imagesFilesSrc.includes(dataURL)) continue;
				imagesFilesSrc.push(dataURL);

				result.data.push({
					type: 'data',
					src: CheckAbsolutePath(dataURL),
					alt: '',
					width: 0,
					height: 0,
				});
			}
		};

		const CollectFromInlineStyle = () => {
			const elementsWithStyle = el.querySelectorAll('[style]');
			for (let i = 0; i < elementsWithStyle.length; i++) {
				ProcessCssStyles(elementsWithStyle[i] as HTMLElement, result);
			}
		};

		const CollectFromStyleTags = () => {
			const styleTags = el.querySelectorAll('style');
			if (styleTags.length === 0) return;
			for (let i = 0; i < styleTags.length; i++) {
				ProcessCssStyles(styleTags[i].innerText, result);
			}
		};

		const ProcessOpenShadowRoots = () => {
			function findShadowRoots(ele: Element): any {
				return [ele, ...ele.querySelectorAll('*')]
					.filter((e) => !!e.shadowRoot)
					.flatMap((e) => [e.shadowRoot, ...findShadowRoots(e.shadowRoot as any)]);
			}
			findShadowRoots(el as any).forEach((root: any) => ProcessElement(root, result, depth + 1));
		};

		await CollectFromCSSBackground();
		CollectFromSrc();
		CollectFromSVGS();
		CollectFromInlineStyle();
		CollectFromStyleTags();

		ProcessOpenShadowRoots();

		return result;
	}

	await ProcessElement(document, result, 1);
	result.count = result.data.length + result.src.length;
	return result;
};

export { CollectAllStaticLinks };
