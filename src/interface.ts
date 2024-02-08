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

interface SearchData {
	field: 'name' | 'alt' | 'src';
	str: string;
}

interface SortOption {
	id: number;
	field: string;
	orderby: 'desc' | 'asc';
	alias: string;
}

interface StaticData {
	id: number;
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
	searchData: SearchData;
	setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
	sortOption: SortOption | null;
	setSortOption: React.Dispatch<React.SetStateAction<SortOption | null>>;
	selectedExtension: string[];
	setSelectedExtension: React.Dispatch<React.SetStateAction<string[]>>;
	selectedLayout: string[];
	setSelectedLayout: React.Dispatch<React.SetStateAction<string[]>>;
	selectedSize: StaticDataSizeFilter;
	setSelectedSize: React.Dispatch<React.SetStateAction<StaticDataSizeFilter>>;
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
}

interface ExtensionStateContextType {
	isHeadOpened: boolean;
	setHeadOpened: React.Dispatch<React.SetStateAction<boolean>>;
	setDataLayout: React.Dispatch<React.SetStateAction<'column' | 'grid'>>;
	dataLayout: 'column' | 'grid';
}

interface GetAllStaticResponse {
	data: StaticData[];
	extensions: { [K: string]: number };
	layout: { [K: string]: number };
	size: { height: { min: number; max: number }; width: { min: number; max: number } };
}

export type {
	StaticData,
	StaticLinksResult,
	StaticLinkData,
	SearchData,
	StaticDataSizeFilter,
	FilterContextType,
	ExtensionStateContextType,
	GetAllStaticResponse,
	SortOption,
};
export { StaticExtensionTypeEnum, StaticImageLayout };
