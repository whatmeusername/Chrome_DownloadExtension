import { ReactElement, useEffect, useRef, useState } from 'react';
import './DownloaderExtension.scss';
import { StaticData, StaticDataSizeFilter, StaticLinksResult } from '../../interface';
import { GetAllStaticResponse, getAllStaticURLS } from '../../utils/getAllStaticURLS';
import { StaticDataElement } from '../StaticDataElement/StaticDataElement';
import { LoadingElement } from '../LoadingElement/LoadingElement';
import { FilterContextElement } from '../FilterContext/FilterContext';
import { ExtensionHead } from '../ExtensionHead/ExtensionHead';

//@ts-ignore
function StaticDataCanvasItem({ StaticData }: { StaticData: StaticData }): ReactElement {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	return <canvas className="static__data__canvas__item" ref={canvasRef} />;
}

//@ts-ignore
function StaticDataCanvas({
	StaticDataArray,
	setIsLoaded,
}: {
	StaticDataArray: StaticData[];
	setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement {
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<div className="static__data__canvas__wrapper">
			{StaticDataArray.map((StaticData, i) => (
				<StaticDataCanvasItem StaticData={StaticData} key={`static__data__canvas__item__${i}`} />
			))}
		</div>
	);
}

function DownloaderExtension({ staticLinks }: { staticLinks: StaticLinksResult }): ReactElement {
	const StaticResponseData = useRef<GetAllStaticResponse>(null!);

	//SELECTED
	const [selectedItems, setSelectedItems] = useState<StaticData[]>([]);

	//DATA
	const [StaticDataResult, setStaticDataResult] = useState<StaticData[]>(null!);

	// FILTERS
	const [selectedExtension, setSelectedExtension] = useState<string[]>([]);
	const [selectedLayout, setSelectedLayout] = useState<string[]>([]);
	const [selectedSize, setSelectedSize] = useState<StaticDataSizeFilter>({ height: { min: null, max: null }, width: { min: null, max: null } });

	useEffect(() => {
		if (!StaticResponseData.current) return;
		let copy: StaticData[] = JSON.parse(JSON.stringify(StaticResponseData.current.data));
		if (selectedExtension.length > 0) {
			copy = copy.filter((data) => selectedExtension.includes(data?.extension ?? ''));
		}
		if (selectedLayout.length > 0) {
			copy = copy.filter((data) => selectedLayout.includes(data?.layout ?? ''));
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
		setStaticDataResult(copy);
	}, [selectedExtension, selectedLayout, selectedSize]);

	useEffect(() => {
		getAllStaticURLS(staticLinks).then((result) => {
			if (result.data.length > 0) {
				StaticResponseData.current = result;
				setStaticDataResult(result.data);
			}
		});
	}, [staticLinks]);

	return (
		<FilterContextElement
			value={{
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
					<StaticDataElement StaticDataArray={StaticDataResult} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
				) : (
					<LoadingElement />
				)}
			</div>
		</FilterContextElement>
	);
}

export { DownloaderExtension };
