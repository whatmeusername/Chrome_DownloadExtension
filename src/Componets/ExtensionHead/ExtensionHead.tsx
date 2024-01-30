import { ReactElement } from 'react';
import { StaticData } from '../../interface';
import { GetAllStaticResponse } from '../../utils/getAllStaticURLS';
import { ExtensionFilter } from '../ExtensionFilter/ExtensionFilter';
import { useFilterContext } from '../FilterContext/FilterContext';
import { LayoutFilter } from '../LayoutFilter/LayoutFilter';
import { SizeFilter } from '../SizeFilter/SizeFilter';
import './ExtensionHead.scss';
import { HeadSelectionElement } from './HeadSelectionElement/HeadSelectionElement';

function ExtensionHead({
	StaticResponseData,
	StaticDataResult,
}: {
	StaticResponseData: React.MutableRefObject<GetAllStaticResponse>;
	StaticDataResult: StaticData[];
}): ReactElement {
	const { selectedExtension, setSelectedExtension, selectedLayout, setSelectedLayout, selectedSize, setSelectedSize } = useFilterContext();

	return (
		<div className="extension__main__head__wrapper">
			<div className="extension__main__head">
				<div className="extension__main__head__filters">
					<ExtensionFilter
						selectedExtension={selectedExtension}
						setSelectedExtension={setSelectedExtension}
						extensionData={StaticResponseData.current?.extensions}
					/>
					<LayoutFilter selectedLayout={selectedLayout} setSelectedLayout={setSelectedLayout} layoutData={StaticResponseData.current?.layout} />
					<SizeFilter selectedSize={selectedSize} setSelectedSize={setSelectedSize} sizeData={StaticResponseData.current?.size} />
				</div>
				<HeadSelectionElement StaticDataResult={StaticDataResult} />
			</div>
		</div>
	);
}

export { ExtensionHead };
