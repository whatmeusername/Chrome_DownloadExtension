import { ReactElement, useEffect, useRef, useState } from 'react';
import './DownloaderExtension.scss';
import { SearchData, SortOption, StaticData, StaticDataSizeFilter, StaticLinksResult } from '../../interface';
import { GetAllStaticResponse, getAllStaticURLS } from '../../utils/getAllStaticURLS';
import { StaticDataElement } from '../StaticDataElement/StaticDataElement';
import { LoadingElement } from '../LoadingElement/LoadingElement';
import { FilterContextElement } from '../FilterContext/FilterContext';
import { ExtensionHead } from '../ExtensionHead/ExtensionHead';

function DownloaderExtension({ staticLinks }: { staticLinks: StaticLinksResult }): ReactElement {
	const StaticResponseData = useRef<GetAllStaticResponse>(null!);

	//SELECTED
	const [selectedItems, setSelectedItems] = useState<StaticData[]>([]);

	//DATA
	const [StaticDataResult, setStaticDataResult] = useState<StaticData[]>(null!);

	// FILTERS
	const [sortOption, setSortOption] = useState<SortOption | null>(null);
	const [searchData, setSearchData] = useState<SearchData>({ str: '', field: 'name' });
	const [selectedExtension, setSelectedExtension] = useState<string[]>([]);
	const [selectedLayout, setSelectedLayout] = useState<string[]>([]);
	const [selectedSize, setSelectedSize] = useState<StaticDataSizeFilter>({ height: { min: null, max: null }, width: { min: null, max: null } });

	useEffect(() => {
		if (!StaticResponseData.current) return;
		let copy: StaticData[] = JSON.parse(JSON.stringify(StaticResponseData.current.data));

		if (searchData.str.length > 0) {
			copy = copy.filter((d) => d[searchData.field]?.includes(searchData.str));
		}

		if (selectedExtension.length > 0) {
			copy = copy.filter((data) => selectedExtension.includes(data.extension));
		}
		if (selectedLayout.length > 0) {
			copy = copy.filter((data) => selectedLayout.includes(data.layout));
		}
		if (selectedSize.height.min || selectedSize.height.max || selectedSize.width.min || selectedSize.width.max) {
			const HMax = selectedSize.height.max;
			const HMin = selectedSize.height.min;
			const WMax = selectedSize.width.max;
			const WMin = selectedSize.width.min;
			copy = copy.filter((data) => {
				if ((HMax && data.height > HMax) || (HMin && data.height < HMin) || (WMax && data.width > WMax) || (WMin && data.width < WMin)) return false;
				return true;
			});
		}
		if (sortOption) {
			const f = sortOption.field as keyof StaticData;
			copy.sort((a: any, b: any) => {
				return (sortOption.orderby === 'asc' ? a?.[f] > b?.[f] : a?.[f] < b?.[f]) ? 1 : -1;
			});
		}
		setSelectedItems([]);
		setStaticDataResult(copy);
	}, [selectedExtension, selectedLayout, selectedSize, sortOption, searchData]);

	useEffect(() => {
		if (!staticLinks) return;
		getAllStaticURLS(staticLinks).then((result) => {
			StaticResponseData.current = result;
			setStaticDataResult(result.data);
		});
	}, [staticLinks]);

	return (
		<FilterContextElement
			value={{
				searchData: searchData,
				setSearchData: setSearchData,
				sortOption: sortOption,
				setSortOption: setSortOption,
				selectedExtension: selectedExtension,
				setSelectedExtension: setSelectedExtension,
				selectedLayout: selectedLayout,
				setSelectedLayout: setSelectedLayout,
				selectedSize: selectedSize,
				setSelectedSize: setSelectedSize,
				selectedItems: selectedItems,
				setSelectedItems: setSelectedItems,
			}}
		>
			<div className="extension__main__wrapper">
				<ExtensionHead StaticResponseData={StaticResponseData} StaticDataResult={StaticDataResult} />
				{StaticResponseData.current && StaticDataResult ? (
					<StaticDataElement
						StaticDataArray={StaticDataResult}
						StaticResponseData={StaticResponseData.current.data}
						selectedItems={selectedItems}
						setSelectedItems={setSelectedItems}
					/>
				) : (
					<LoadingElement count={staticLinks?.count} />
				)}
			</div>
		</FilterContextElement>
	);
}

export { DownloaderExtension };
