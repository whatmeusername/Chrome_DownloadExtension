import { StaticLinksResult } from '../interface';

const CollectAllStaticLinks = (document: Document): StaticLinksResult => {
	const imagesFilesSrc: string[] = [];
	const cssURLRegex = /url\(['"]?([^")]+)/g;
	const result: StaticLinksResult = { data: [], src: [] };

	const CollectFromCSSBackground = () => {
		if (document.styleSheets.length > 0) {
			const imageUrls: string[] = [];
			const rules = document.styleSheets[0].cssRules as unknown as CSSStyleRule[];
			for (let i = 0; i < rules.length; i++) {
				const backgroundImageMatch: string[] = cssURLRegex.exec(rules[i].style?.backgroundImage) ?? [];
				const backgroundMatch: string[] = cssURLRegex.exec(rules[i].style?.background) ?? [];

				const cssRuleImages: string[] = ([] as string[]).concat(backgroundImageMatch, backgroundMatch);

				if (!cssRuleImages) continue;
				for (let j = 0; j < cssRuleImages.length; j++) {
					const currentURL = cssRuleImages[j];
					if (currentURL.startsWith('url') || imageUrls.includes(currentURL)) continue;
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
			}
		}
	};

	const CollectFromImgTags = () => {
		const images = document.querySelectorAll('img');
		for (let i = 0; i < images.length; i++) {
			const image = images[i];

			if (image.naturalWidth === 0 || image.naturalHeight === 0 || imagesFilesSrc.includes(image.src)) continue;

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
		const svgs = document.querySelectorAll('svg');
		for (let i = 0; i < svgs.length; i++) {
			const svg = svgs[i];

			var serializedSVG = new XMLSerializer().serializeToString(svg);
			result.data.push({
				type: 'data',
				src: 'data:image/svg+xml;base64,' + window.btoa(serializedSVG),
				alt: '',
				width: 0,
				height: 0,
			});
		}
	};

	CollectFromCSSBackground();
	CollectFromImgTags();
	CollectFromSVGS();

	return result;
};

export { CollectAllStaticLinks };
