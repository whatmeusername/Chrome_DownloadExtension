import { StaticLinksResult } from '../interface';
import { CollectAllStaticLinks, FilterStaticLinks } from './CollectAllStaticLinks';

function ChromeCollectData(setStaticLinks: React.Dispatch<React.SetStateAction<StaticLinksResult>>) {
	chrome.tabs.query({ active: true }).then(([tab]) => {
		if (tab && tab.id !== undefined) {
			chrome.scripting
				.executeScript({
					target: { tabId: tab.id },
					func: () => {
						const CollectAllStaticLinks = async (
							result: StaticLinksResult | undefined,
							document: Document | null | undefined | string,
							isIFrame: boolean,
						): Promise<StaticLinksResult> => {
							result = result ?? { data: [], src: [], count: 0, iframesSrc: [] };

							if (typeof document === 'string' && isIFrame) {
								try {
									const htmlText = await (await fetch(document)).text();
									document = new DOMParser().parseFromString(htmlText, 'text/html');
								} catch {
									return result;
								}
							} else if (!document) return result;
							else document = document as Document;

							const windowDomain = window.location.host;
							const protocol = window?.location?.protocol ?? '';
							const imagesFilesSrc: string[] = [];
							const cssURLRegex = /(?<=url\()['"]?([^")]+)/g;
							const ALLOWED_IMAGE_EXTENSION = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'svg', 'bmp', 'ico', 'tiff'];

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
									let currentURL = cssRuleImages[j];

									if (currentURL.startsWith('"')) currentURL = currentURL.slice(1);
									if (imagesFilesSrc.includes(currentURL)) continue;
									if (!ValidateExtension(currentURL)) continue;
									imagesFilesSrc.push(currentURL);

									const isUrlData = currentURL.startsWith('data:');
									const insertInto: any[] = isUrlData ? result.data : result.src;
									if (isUrlData || isHttpUrl(currentURL)) {
										insertInto.push({
											type: isUrlData ? 'data' : 'src',
											src: isUrlData ? currentURL : CheckAbsolutePath(currentURL),
											alt: '',
											width: null,
											height: null,
										});
									}
								}
								return result;
							}

							// @ts-ignore
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
											if (!sHref) continue;
											const fetchResult = await fetch(sHref);
											if (!fetchResult.ok) continue;
											const text = await (await fetch(sHref)).text();
											ProcessCssStyles(text, result);
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

										const isUrlData = el.src.startsWith('data:');
										const insertInto: any[] = isUrlData ? result.data : result.src;
										if (isUrlData || isHttpUrl(el.src)) {
											insertInto.push({
												type: isUrlData ? 'data' : 'src',
												src: isUrlData ? el.src : CheckAbsolutePath(el.src),
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
											src: CheckAbsolutePath(dataURL),
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
											result.iframesSrc.push(iframes[i].src);
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
							result.count = result.data.length + result.src.length;
							return result;
						};

						return CollectAllStaticLinks(undefined, document, false);
					},
				})
				.then(async (data) => {
					const result = data[0].result;
					for (let i = 0; i < result.iframesSrc.length; i++) {
						await CollectAllStaticLinks(result, result.iframesSrc[i], true);
					}
					setStaticLinks(FilterStaticLinks(result));
				});
		}
	});
}

export { ChromeCollectData };
