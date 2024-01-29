import { ALOWED_IMAGE_EXTENSION } from '../consts/allowed_extensions';
import { StaticData, StaticImageLayout, StaticExtensionTypeEnum, StaticLinksResult } from '../interface';

interface GetAllStaticResponse {
	data: StaticData[];
	extensions: { [K: string]: number };
	layout: { [K: string]: number };
	size: { height: { min: number; max: number }; width: { min: number; max: number } };
}
async function getAllStaticURLS(staticLinks: StaticLinksResult): Promise<GetAllStaticResponse> {
	const promiseQuery = [];

	const getImageLayout = (width: number, height: number): StaticImageLayout => {
		if (width === height) return StaticImageLayout.SQUARE;
		else if (width > height) return StaticImageLayout.WIDE;
		else if (width < height) return StaticImageLayout.TALL;
		return StaticImageLayout.ALL;
	};

	for (let i = 0; i < staticLinks.src.length; i++) {
		const image = staticLinks.src[i];

		promiseQuery.push(
			fetch(image.src)
				.then((res) => {
					return new Promise(async (resolve) => {
						const blob = await res.blob();
						const extension = res.headers
							.get('content-type')
							?.split(/[\/\+]/)[1]
							.trim();

						resolve({
							blob: blob,
							extension: extension ?? null,
						});
					}) as Promise<{ blob: Blob; extension: string | null }>;
				})
				.then((result) => {
					const pathsSplit = image.src.split('/');
					const extensionNameSplit = pathsSplit[pathsSplit.length - 1].split('.');

					if (ALOWED_IMAGE_EXTENSION.includes(result.extension ?? '')) {
						return {
							blob: result.blob,
							type: image.type,
							src: image.src,
							name: extensionNameSplit[0],
							alt: image.alt ?? null,
							extension: result.extension,
							imageType: result.extension === StaticExtensionTypeEnum.SVG ? StaticExtensionTypeEnum.SVG : StaticExtensionTypeEnum.IMAGE,
							width: image.width,
							height: image.height,
							size: result.blob.size,
							layout: getImageLayout(image.width, image.height),
						};
					}
				}),
		);
	}

	const dataResults = [];
	for (let i = 0; i < staticLinks.data.length; i++) {
		const image = staticLinks.data[i];
		const extension = image.src?.match(/[data:image\][\w]+(?=[;+])/)?.[0];
		const size = image.src.substring(image.src.indexOf(',') + 1).length * 6;
		dataResults.push({
			blob: null,
			type: image.type,
			src: image.src,
			name: '',
			alt: image.alt ?? null,
			extension: extension,
			imageType: extension === StaticExtensionTypeEnum.SVG ? StaticExtensionTypeEnum.SVG : StaticExtensionTypeEnum.IMAGE,
			width: 0,
			height: 0,
			size: size,
			layout: getImageLayout(0, 0),
		});
	}

	const srcResults = await Promise.all(promiseQuery);

	const result = [...srcResults, ...dataResults].filter((r) => r !== undefined) as StaticData[];

	const layoutResult: { [K: string]: number } = {};
	const extensionsObject: { [K: string]: number } = {};
	const sizeResults: GetAllStaticResponse['size'] = { height: { min: null, max: null }, width: { min: null, max: null } } as any;
	for (let i = 0; i < result.length; i++) {
		layoutResult[result[i].layout] = layoutResult[result[i].layout] ? layoutResult[result[i].layout] + 1 : 1;
		extensionsObject[result[i].extension] = extensionsObject[result[i].extension] ? extensionsObject[result[i].extension] + 1 : 1;

		const { width, height } = result[i];
		if (sizeResults.height.min === null || sizeResults.height.min > height) sizeResults.height.min = height;
		if (sizeResults.height.max === null || sizeResults.height.max < height) sizeResults.height.max = height;

		if (sizeResults.width.min === null || sizeResults.width.min > width) sizeResults.width.min = width;
		if (sizeResults.width.max === null || sizeResults.width.max < width) sizeResults.width.max = width;
	}

	return { data: result, extensions: extensionsObject, layout: layoutResult, size: sizeResults };
}

export type { GetAllStaticResponse };
export { getAllStaticURLS };
