import { StaticLinksResult } from '../interface';

const CollectAllStaticLinks = (document: Document): StaticLinksResult => {
	const imagesFilesSrc: string[] = [];
	const cssURLRegex = /url\(['"]?([^")]+)/g;
	const result: StaticLinksResult = { data: [], src: [] };
	const MAX_DEPTH = 3;

	const IsNotValidImageData = (image: HTMLImageElement): boolean => {
		const isLessThatMin = image.naturalWidth < 10 || image.naturalHeight < 10;
		const isZeroSize = image.naturalWidth === 0 || image.naturalHeight === 0;
		return isLessThatMin || isZeroSize || imagesFilesSrc.includes(image.src);
	};

	function ProcessCssStyles(cssRuleImages: string[], result: StaticLinksResult): StaticLinksResult {
		if (cssRuleImages.length === 0) return result;
		for (let j = 0; j < cssRuleImages.length; j++) {
			const currentURL = cssRuleImages[j];

			if (currentURL.startsWith('url') || imagesFilesSrc.includes(currentURL)) continue;
			imagesFilesSrc.push(currentURL);

			// VALIDATE EXTENSION OR RELATIVE PATH
			if (currentURL.startsWith('data:')) {
				result.data.push({
					type: 'data',
					src: currentURL,
					alt: '',
					width: 0,
					height: 0,
				});
			} else if (currentURL.startsWith('http') || currentURL.startsWith('https')) {
				result.src.push({
					type: 'src',
					src: currentURL,
					alt: '',
					width: 0,
					height: 0,
				});
			}
		}
		return result;
	}

	function ProcessElement(el: HTMLElement | Document, result: StaticLinksResult, depth: number): StaticLinksResult {
		if (depth === MAX_DEPTH) return result;

		const CollectFromCSSBackground = () => {
			const styleSheets = el.nodeType === el.DOCUMENT_NODE ? (el as Document).styleSheets : (el as Element).ownerDocument.styleSheets;
			if (styleSheets.length > 0) {
				const rules = styleSheets[0].cssRules as unknown as CSSStyleRule[];
				for (let i = 0; i < rules.length; i++) {
					const backgroundImageMatch: string[] = cssURLRegex.exec(rules[i].style?.backgroundImage) ?? [];
					const backgroundMatch: string[] = cssURLRegex.exec(rules[i].style?.background) ?? [];

					const cssRuleImages: string[] = ([] as string[]).concat(backgroundImageMatch, backgroundMatch);

					ProcessCssStyles(cssRuleImages, result);
				}
			}
		};

		const CollectFromImgTags = () => {
			const images = el.querySelectorAll('img');
			for (let i = 0; i < images.length; i++) {
				const image = images[i];
				if (IsNotValidImageData(image)) continue;

				imagesFilesSrc.push(image.src);

				if (image.src.startsWith('data:')) {
					result.data.push({
						type: 'data',
						src: image.src,
						alt: '',
						width: 0,
						height: 0,
					});
				} else {
					result.src.push({
						type: 'src',
						src: image.src,
						alt: image.alt,
						width: image.naturalWidth,
						height: image.naturalHeight,
					});
				}
			}
		};

		const CollectFromSVGS = () => {
			const svgs = el.querySelectorAll('svg');
			for (let i = 0; i < svgs.length; i++) {
				const serializedSVG = new XMLSerializer().serializeToString(svgs[i]);
				const dataURL = 'data:image/svg+xml;base64,' + window.btoa(serializedSVG);

				if (imagesFilesSrc.includes(dataURL)) continue;
				imagesFilesSrc.push(dataURL);

				result.data.push({
					type: 'data',
					src: dataURL,
					alt: '',
					width: 0,
					height: 0,
				});
			}
		};

		const CollectFromInlineStyle = () => {
			const elementsWithStyle = el.querySelectorAll('[style]');
			for (let i = 0; i < elementsWithStyle.length; i++) {
				const elWithStyle = elementsWithStyle[i] as HTMLElement;

				const backgroundImageMatch: string[] = cssURLRegex.exec(elWithStyle.style.background) ?? [];
				const backgroundMatch: string[] = cssURLRegex.exec(elWithStyle.style.backgroundImage) ?? [];
				const cssRuleImages: string[] = ([] as string[]).concat(backgroundImageMatch, backgroundMatch);

				ProcessCssStyles(cssRuleImages, result);
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

		const CollectFromStyleTags = () => {
			const styleTags = el.querySelectorAll('style');
			for (let i = 0; i < styleTags.length; i++) {
				const styleTag = styleTags[i];
				const cssRuleImages: string[] = cssURLRegex.exec(styleTag.innerText) ?? [];
				ProcessCssStyles(cssRuleImages, result);
			}
		};

		CollectFromCSSBackground();
		CollectFromImgTags();
		CollectFromSVGS();
		CollectFromInlineStyle();
		CollectFromStyleTags();

		ProcessOpenShadowRoots();

		return result;
	}

	return ProcessElement(document, result, 1);
};

export { CollectAllStaticLinks };
