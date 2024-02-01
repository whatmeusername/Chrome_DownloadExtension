import { ALLOWED_IMAGE_EXTENSION } from '../consts/allowed_extensions';
import { StaticData, StaticImageLayout, StaticExtensionTypeEnum, StaticLinksResult, GetAllStaticResponse } from '../interface';

const GetFiltersDataFromResult = (results: StaticData[]) => {
	const layoutResult: { [K: string]: number } = {};
	const extensionsObject: { [K: string]: number } = {};
	const sizeResults: GetAllStaticResponse['size'] = {
		height: { min: null, max: null },
		width: { min: null, max: null },
	} as any;
	for (let i = 0; i < results.length; i++) {
		const { width, height, layout, extension } = results[i];
		if (layout) {
			layoutResult[layout] = layoutResult[layout] ? layoutResult[layout] + 1 : 1;
		}
		if (extension) {
			extensionsObject[extension] = extensionsObject[extension] ? extensionsObject[extension] + 1 : 1;
		}

		if (width === 0 && height === 0) continue;

		if (sizeResults.height.min === null || sizeResults.height.min > height) sizeResults.height.min = height;
		if (sizeResults.height.max === null || sizeResults.height.max < height) sizeResults.height.max = height;

		if (sizeResults.width.min === null || sizeResults.width.min > width) sizeResults.width.min = width;
		if (sizeResults.width.max === null || sizeResults.width.max < width) sizeResults.width.max = width;
	}
	return { layoutResult, extensionsObject, sizeResults };
};

const GetFetchPromise = (res: Response): Promise<{ blob: Blob; extension: string | null }> => {
	return new Promise(async (resolve) => {
		const blob = await res.blob();
		const extension = res.headers
			.get('content-type')
			?.split(/[\/\+]/)[1]
			.trim();

		resolve({
			blob: blob,
			extension: extension?.trim()?.toLowerCase() ?? null,
		});
	});
};

const ValidateExtension = (extension: string | null | undefined): boolean => {
	return extension !== undefined && extension !== '' && ALLOWED_IMAGE_EXTENSION.includes(extension ?? '');
};

const GetImageType = (extension: string | undefined | null): StaticExtensionTypeEnum => {
	return extension === StaticExtensionTypeEnum.SVG ? StaticExtensionTypeEnum.SVG : StaticExtensionTypeEnum.IMAGE;
};

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
					return GetFetchPromise(res);
				})
				.then((result) => {
					const pathsSplit = image.src.split('/');
					const extensionNameSplit = pathsSplit[pathsSplit.length - 1].split('.');

					if (!ValidateExtension(result.extension)) return;
					return {
						blob: result.blob,
						type: image.type,
						src: image.src,
						name: extensionNameSplit[0],
						alt: image.alt ?? null,
						extension: result.extension,
						imageType: GetImageType(result.extension),
						width: image.width,
						height: image.height,
						size: result.blob.size,
						layout: getImageLayout(image.width, image.height),
					};
				}),
		);
	}

	for (let i = 0; i < staticLinks.data.length; i++) {
		const image = staticLinks.data[i];
		promiseQuery.push(
			fetch(image.src)
				.then((res) => {
					return GetFetchPromise(res);
				})
				.then((result) => {
					if (!ValidateExtension(result.extension)) return;

					return {
						blob: result.blob,
						type: image.type,
						src: image.src,
						name: '',
						alt: image.alt ?? null,
						extension: result.extension,
						imageType: GetImageType(result.extension),
						width: 0,
						height: 0,
						size: result.blob.size,
						layout: getImageLayout(0, 0),
					};
				}),
		);
	}

	const results = (await Promise.all(promiseQuery)).filter((r) => r !== undefined) as StaticData[];
	const { layoutResult, extensionsObject, sizeResults } = GetFiltersDataFromResult(results);

	return { data: results, extensions: extensionsObject, layout: layoutResult, size: sizeResults };
}

export type { GetAllStaticResponse };
export { getAllStaticURLS };
