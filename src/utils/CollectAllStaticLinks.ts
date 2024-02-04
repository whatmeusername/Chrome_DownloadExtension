import { StaticLinksResult, StaticLinkData } from '../interface';

const FilterStaticLinks = (links: StaticLinksResult): StaticLinksResult => {
	const fn = (d: StaticLinkData): boolean => {
		if (d.width === null || d.height === null) return true;
		return d.width >= 10 || d.height >= 10;
	};

	links.data = links.data.filter(fn);
	links.count = links.data.length;
	return links;
};

const CollectAllStaticLinks = async (
	result: StaticLinksResult | undefined,
	document: Document | null | undefined | string,
	fetchLike?: 'iframe' | 'css',
): Promise<StaticLinksResult> => {
	const windowDomain = window.location.host;
	const protocol = window?.location?.protocol ?? '';
	const imagesFilesSrc: string[] = [];
	const cssURLRegex = /(?<=url\()['"]?([^")]+)/g;
	const ALLOWED_IMAGE_EXTENSION = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'svg', 'bmp', 'ico', 'tiff'];
	result = result ?? { data: [], count: 0, iFramesOrigins: [], CssOrgins: [] };

	function isDataUrl(url: string): boolean {
		return url.startsWith('data:') || url.startsWith('blob:');
	}

	function isHttpUrl(url: string): boolean {
		return url.startsWith('//') || url.startsWith('http') || url.startsWith('https');
	}

	function IsNotValidImageData(el: HTMLImageElement): boolean {
		if (el.nodeName === 'img') {
			const isLessThatMin = el.naturalWidth < 10 || el.naturalHeight < 10;
			const isZeroSize = el.naturalWidth === 0 || el.naturalHeight === 0;
			return isLessThatMin || isZeroSize || imagesFilesSrc.includes(el.src);
		}
		return imagesFilesSrc.includes(el?.src);
	}

	function ValidateExtension(src: string): boolean {
		if (!src) return false;
		const extension = src
			.split(/\.([^\./\?\#]+)($|\?|\#)/g)?.[1]
			?.trim()
			?.toLowerCase();

		if (extension) {
			return ALLOWED_IMAGE_EXTENSION.includes(extension);
		}
		return true;
	}

	function CheckPath(url: string, prefix?: string): string {
		if (prefix && (url.startsWith('/') || url.startsWith('..') || !isHttpUrl(url))) {
			return prefix + url;
		} else if (url.startsWith('//')) {
			return protocol + url;
		}
		return url;
	}

	function TrimUrl(url: string): string {
		if (url.startsWith('"') || url.startsWith("'")) url = url.slice(1);
		if (url.endsWith('"') || url.endsWith("'")) url = url.slice(0, -1);
		return url;
	}

	if (typeof document === 'string' && fetchLike === 'iframe') {
		try {
			const htmlText = await (await fetch(document)).text();
			document = new DOMParser().parseFromString(htmlText, 'text/html');
		} catch {
			return result;
		}
	} else if (typeof document === 'string' && fetchLike === 'css') {
		const fetchResult = await fetch(document);
		if (!fetchResult.ok) return result;
		const text = await fetchResult.text();
		const href = new URL(document);
		return ProcessCssStyles(text, result, `${href.origin}/`);
	} else if (!document) return result;
	else document = document as Document;

	function ProcessCssStyles(source: HTMLElement | CSSRule | string, result: StaticLinksResult, prefix?: string): StaticLinksResult {
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

		for (let i = 0; i < cssRuleImages.length; i++) {
			let currentURL = TrimUrl(cssRuleImages[i]);

			if (imagesFilesSrc.includes(currentURL) || !ValidateExtension(currentURL)) continue;

			const isUrlData = isDataUrl(currentURL);
			const url = isUrlData ? currentURL : CheckPath(currentURL, prefix);

			imagesFilesSrc.push(currentURL);

			if (isUrlData || isHttpUrl(url)) {
				result.data.push({
					type: isUrlData ? 'data' : 'src',
					src: url,
					alt: '',
					width: null,
					height: null,
				});
			}
		}

		return result;
	}

	async function ProcessElement(el: HTMLElement | Document, result: StaticLinksResult, isInner: boolean): Promise<StaticLinksResult> {
		const CollectFromCSSBackground = async () => {
			const styleSheets = el.nodeType === el.DOCUMENT_NODE ? (el as Document).styleSheets : (el as Element).ownerDocument.styleSheets;
			if (styleSheets.length === 0) return;
			for (let i = 0; i < styleSheets.length; i++) {
				try {
					const rules = styleSheets[i].cssRules as unknown as CSSStyleRule[];
					for (let i = 0; i < rules.length; i++) {
						ProcessCssStyles(rules[i], result);
					}
				} catch {
					const sHref = styleSheets[i].href;
					if (sHref && new URL(sHref).host === windowDomain) {
						const fetchResult = await fetch(sHref);
						if (!fetchResult.ok) continue;
						const text = await fetchResult.text();
						ProcessCssStyles(text, result);
					} else if (sHref) {
						result.CssOrgins.push(sHref);
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

				const isUrlData = isDataUrl(el.src);
				if (isUrlData || isHttpUrl(el.src)) {
					result.data.push({
						type: isUrlData ? 'data' : 'src',
						src: isUrlData ? el.src : CheckPath(el.src),
						alt: isUrlData ? '' : el.alt,
						width: el.naturalWidth ?? el.width ?? null,
						height: el.naturalHeight ?? el.height ?? null,
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

				const rect = svgs[i].getBoundingClientRect();
				result.data.push({
					type: 'data',
					src: CheckPath(dataURL),
					alt: '',
					width: rect.width,
					height: rect.height,
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
			findShadowRoots(el as any).forEach((root: any) => ProcessElement(root, result, true));
		};

		const ProcessIFrames = async () => {
			const iframes = el.querySelectorAll('iframe');
			for (let i = 0; i < iframes.length; i++) {
				const isSameDomain = !iframes[i].src ? true : new URL(iframes[i].src).host === windowDomain;
				if (isSameDomain) {
					const doc = iframes[i]?.contentDocument ?? iframes[i]?.contentWindow?.document;
					if (doc) await ProcessElement(doc, result, true);
				} else {
					result.iFramesOrigins.push(iframes[i].src);
				}
			}
		};

		await CollectFromCSSBackground();
		CollectFromSrc();
		CollectFromSVGS();
		CollectFromInlineStyle();
		CollectFromStyleTags();

		if (!isInner) {
			await ProcessIFrames();
			ProcessOpenShadowRoots();
		}

		return result;
	}

	await ProcessElement(document, result, false);

	result.count = result.data.length;

	return result;
};
export { CollectAllStaticLinks, FilterStaticLinks };
