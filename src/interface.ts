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
	src: StaticLinksSrc[];
	data: StaticLinksData[];
}

type StaticLinksSrc = {
	type: 'src';
	src: string;
	alt: string;
	width: number;
	height: number;
};

type StaticLinksData = {
	type: 'data';
	src: string;
	alt: string;
	width: number;
	height: number;
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

export type { StaticData, StaticLinksResult, StaticLinksSrc, StaticLinksData, StaticDataSizeFilter, FilterContextType };
export { StaticExtensionTypeEnum, StaticImageLayout };