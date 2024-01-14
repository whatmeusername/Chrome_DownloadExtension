import { StaticLinksResult } from '../interface';

function ChromeCollectData(
	setLoaded: React.Dispatch<React.SetStateAction<number>>,
	setStaticLinks: React.Dispatch<React.SetStateAction<StaticLinksResult>>,
) {
	chrome.tabs.query({ active: true }).then(([tab]) => {
		if (tab && tab.id !== undefined) {
			chrome.scripting
				.executeScript({
					target: { tabId: tab.id },
					func: () => {
						const CollectAllStaticLinks = (document: Document): StaticLinksResult => {
							const imagesFilesSrc: string[] = [];
							const images = document.querySelectorAll('img');
							const svgs = document.querySelectorAll('svg');
							const result: StaticLinksResult = { data: [], src: [] };

							if (document.styleSheets.length > 0) {
								const imageUrls: string[] = [];
								const rules = document.styleSheets[0].cssRules as unknown as CSSStyleRule[];
								for (let i = 0; i < rules.length; i++) {
									const rule = rules[i];
									const UrlImageBG = rule.style?.backgroundImage?.match(/url\(\"(.+)\"\)/);
									if (UrlImageBG && !imageUrls.includes(UrlImageBG[1])) {
										imageUrls.push(UrlImageBG[1]);
										if (UrlImageBG[1].startsWith('data:')) {
											result.data.push({
												type: 'data',
												src: UrlImageBG[1],
												alt: '',
												width: 0,
												height: 0,
											});
										} else if (UrlImageBG[1].startsWith('http') || UrlImageBG[1].startsWith('https')) {
											result.src.push({
												type: 'src',
												src: UrlImageBG[1],
												alt: '',
												width: 0,
												height: 0,
											});
										}
									}
								}
							}

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

							return result;
						};
						return CollectAllStaticLinks(document);
					},
				})
				.then((data) => {
					setLoaded(1);
					setStaticLinks(data[0].result);
				});
		}
	});
}

export { ChromeCollectData };
