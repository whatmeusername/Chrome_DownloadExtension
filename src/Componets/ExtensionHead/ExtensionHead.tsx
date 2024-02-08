import { ReactElement } from 'react';
import { StaticData } from '../../interface';
import { GetAllStaticResponse } from '../../utils/getAllStaticURLS';
import { ExtensionFilter } from '../ExtensionFilter/ExtensionFilter';
import { useFilterContext } from '../FilterContext/FilterContext';
import { LayoutFilter } from '../LayoutFilter/LayoutFilter';
import { SizeFilter } from '../SizeFilter/SizeFilter';
import './ExtensionHead.scss';
import { HeadSelectionElement } from './HeadSelectionElement/HeadSelectionElement';
import { SortElement } from '../SortElement/SortElement';
import { SearchElement } from '../SearchElement/SearchElement';
import { ThinLineElement } from '../shared/ThinLineElement';
import { ToggleHeadButton } from './OpenHeadButton/OpenHeadButton';
import { useExtensionStateContext } from '../ExtensionStateContext/ExtensionStateContext';

function ExtensionHead({
	StaticResponseData,
	StaticDataResult,
}: {
	StaticResponseData: React.MutableRefObject<GetAllStaticResponse>;
	StaticDataResult: StaticData[];
}): ReactElement {
	const { sortOption, setSortOption, selectedExtension, setSelectedExtension, selectedLayout, setSelectedLayout, selectedSize, setSelectedSize } =
		useFilterContext();
	const { isHeadOpened } = useExtensionStateContext();
	return (
		<div
			className={`extension__main__head__wrapper ${
				!isHeadOpened ? 'extension__main__head__wrapper__closed' : 'extension__main__head__wrapper__opened'
			}`}
		>
			{!isHeadOpened ? <ToggleHeadButton isClose={false} /> : null}
			<div className="extension__main__head">
				<SearchElement StaticResponseData={StaticResponseData.current} />
				<div className="extension__main__head__filters">
					<ExtensionFilter
						selectedExtension={selectedExtension}
						setSelectedExtension={setSelectedExtension}
						extensionData={StaticResponseData.current?.extensions}
					/>
					<LayoutFilter selectedLayout={selectedLayout} setSelectedLayout={setSelectedLayout} layoutData={StaticResponseData.current?.layout} />
					<SizeFilter selectedSize={selectedSize} setSelectedSize={setSelectedSize} sizeData={StaticResponseData.current?.size} />
					<SortElement
						sortOption={sortOption}
						setSortOption={setSortOption}
						disabled={StaticResponseData.current === null || StaticResponseData.current?.data?.length === 0}
					/>
				</div>
				<ThinLineElement />
				<HeadSelectionElement StaticDataResult={StaticDataResult} />
			</div>
		</div>
	);
}

export { ExtensionHead };
