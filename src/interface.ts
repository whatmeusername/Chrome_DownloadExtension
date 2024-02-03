enum StaticExtensionTypeEnum {
	IMAGE = 'image',
	SVG = 'svg',
}

enum StaticImageLayout {
	ALL = 'all',
	TALL = 'tall',
	SQUARE = 'square',
	WIDE = 'wide',
}

interface StaticLinksResult {
	data: StaticLinkData[];
	iFramesOrigins: string[];
	CssOrgins: string[];
	count: number;
}

type StaticLinkData = {
	type: 'src' | 'data';
	src: string;
	alt: string;
	width: number | null;
	height: number | null;
};

interface StaticData {
	type: 'data' | 'src';
	src: string;
	name: string;
	alt: string | null;
	extension: string;
	imageType: StaticExtensionTypeEnum;
	width: number;
	height: number;
	size: number | null;
	layout: StaticImageLayout;
}

interface StaticDataSizeFilter {
	height: { min: number | null; max: number | null };
	width: { min: number | null; max: number | null };
}

interface FilterContextType {
	selectedExtension: string[];
	setSelectedExtension: React.Dispatch<React.SetStateAction<string[]>>;
	selectedLayout: string[];
	setSelectedLayout: React.Dispatch<React.SetStateAction<string[]>>;
	selectedSize: StaticDataSizeFilter;
	setSelectedSize: React.Dispatch<React.SetStateAction<StaticDataSizeFilter>>;
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
}

interface GetAllStaticResponse {
	data: StaticData[];
	extensions: { [K: string]: number };
	layout: { [K: string]: number };
	size: { height: { min: number; max: number }; width: { min: number; max: number } };
}

export type { StaticData, StaticLinksResult, StaticLinkData, StaticDataSizeFilter, FilterContextType, GetAllStaticResponse };
export { StaticExtensionTypeEnum, StaticImageLayout };
