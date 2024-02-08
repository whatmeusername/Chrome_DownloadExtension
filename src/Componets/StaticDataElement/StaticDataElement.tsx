import { ReactElement, useState } from 'react';
import { StaticData } from '../../interface';
import { ChromeDownloadFile } from '../../utils/ChromeDownloadFile';
import './StaticDataElement.scss';
import { DownloadIcon, LinkIcon, NoImageIcon } from '../icons';
import { ThinLineElement } from '../shared/ThinLineElement';
import { CalculateFileSize } from '../../utils/CalculateFileSize';
import { useExtensionStateContext } from '../ExtensionStateContext/ExtensionStateContext';

const onUrlClick = (e: React.MouseEvent, src: string) => {
	e.stopPropagation();
	const cw = window.open();
	cw?.document.write(`<img src="${src}"/>`);
};

function OpenAtNewTab({ StaticData }: { StaticData: StaticData }): ReactElement {
	if (StaticData.type === 'data') {
		return (
			<button
				onClick={(e) => onUrlClick(e, StaticData.src)}
				className="static__data__item__img__info__item static__data__item__img__info__item__link static__data__item__img__info__item__click"
			>
				<LinkIcon className="static__data__item__img__info__item__link__icon" />
			</button>
		);
	} else {
		return (
			<a href={StaticData.src} className="static__data__item__img__info__item static__data__item__img__info__item__link" target="_blank">
				<LinkIcon className="static__data__item__img__info__item__link__icon" />
			</a>
		);
	}
}

function SizeElement({ fileSize }: { fileSize: number | null }): ReactElement | null {
	if (!fileSize) return null;
	const { size, unit } = CalculateFileSize(fileSize);
	return (
		<div className="static__data__item__img__info__item static__data__item__img__info__item__size">
			{size} {unit}
		</div>
	);
}

function DimensionElement({ StaticData }: { StaticData: StaticData }): ReactElement | null {
	const { width, height } = StaticData;
	if (width === null || height === null || width === 0 || height == 0) return null;
	return (
		<div className="static__data__item__img__info__item static__data__item__img__info__item__sizes">
			{width}x{height}
		</div>
	);
}

const availableZooms = [1, 1.25, 1.5, 2, 2.5, 3];

function ZoomElement({
	currentZoom,
	setCurrentZoom,
}: {
	currentZoom: number;
	setCurrentZoom: React.Dispatch<React.SetStateAction<number>>;
}): ReactElement {
	const SetNextZoom = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCurrentZoom(currentZoom === availableZooms.length - 1 ? 0 : currentZoom + 1);
	};
	return (
		<div
			className="static__data__item__img__info__item static__data__item__img__info__item__zoom static__data__item__img__info__item__click"
			onClick={SetNextZoom}
		>
			Zoom: {availableZooms[currentZoom]}
		</div>
	);
}
function StaticDataItemElement({
	StaticData,
	selectedItems,
	setSelectedItems,
	dataLayout,
}: {
	StaticData: StaticData;
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
	dataLayout: 'grid' | 'column';
}): ReactElement {
	const [currentZoom, setCurrentZoom] = useState<number>(0);
	const activeIndex = selectedItems.findIndex((i) => i.src === StaticData.src);

	const SetItemActive = () => {
		if (activeIndex !== -1) {
			setSelectedItems(selectedItems.filter((i) => i.src !== StaticData.src));
		} else {
			setSelectedItems([...selectedItems, StaticData]);
		}
	};

	const OnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, key: 'name' | 'alt') => {
		const value = (e.target as HTMLInputElement).value;
		if (key) {
			StaticData.name = value;
		} else {
			StaticData.alt = value;
		}
	};

	return (
		<div
			className={`static__data__item ${dataLayout === 'column' ? 'static__data__item__column' : ''} ${
				activeIndex !== -1 ? 'static__data__item__active' : ''
			}`}
		>
			<div className="static__data__item__content">
				<div className="static__data__item__img__wrapper" onClick={SetItemActive}>
					<div className="static__data__item__img__info">
						<div className="static__data__item__zoom__wrapper">
							<ZoomElement currentZoom={currentZoom} setCurrentZoom={setCurrentZoom} />
						</div>
						<div className="static__data__item__img__info__main">
							<div className="static__data__item__img__info__item static__data__item__img__info__item__extension">{StaticData.extension}</div>
							<SizeElement fileSize={StaticData.size} />
							<DimensionElement StaticData={StaticData} />
							<OpenAtNewTab StaticData={StaticData} />
						</div>
					</div>
					<img
						className="static__data__item__img"
						src={StaticData.src}
						alt={StaticData.alt ?? undefined}
						style={currentZoom !== 0 ? { transform: `scale(${availableZooms[currentZoom]})` } : undefined}
					/>
				</div>
				<div className="static__data__item__info">
					<ThinLineElement />
					<button
						onClick={(e) => onUrlClick(e, StaticData.src)}
						className="static__data__item__names__label__item static__data__item__names__label__item__href"
						title={StaticData.src}
					>
						<p className="static__data__item__names__prefix">Url:</p>
						<p className="static__data__item__label__href__text">{StaticData.src}</p>
					</button>
					<div className="static__data__item__names">
						<div className="static__data__item__names__label__item" title={StaticData?.name ?? 'Name is empty'}>
							<p className="static__data__item__names__prefix">Name:</p>
							<input
								type="text"
								className="static__data__item__names__label__input"
								defaultValue={StaticData.name ?? 'None'}
								onKeyUp={(e) => OnKeyUp(e, 'name')}
							/>
						</div>
						<div className="static__data__item__names__label__item" title={StaticData?.alt ?? 'Alt is empty'}>
							<p className="static__data__item__names__prefix">Alt:</p>
							<input
								type="text"
								className="static__data__item__names__label__input"
								defaultValue={StaticData.alt ?? 'None'}
								onKeyUp={(e) => OnKeyUp(e, 'alt')}
							/>
						</div>
					</div>
					<div className="static__data__item__buttons">
						<button className="static__data__item__button static__data__item__button__download" onClick={() => ChromeDownloadFile(StaticData)}>
							<DownloadIcon className="static__data__item__button__icon" />
							<p className="static__data__item__button__label">Download image</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
function StaticDataElement({
	StaticDataArray,
	selectedItems,
	setSelectedItems,
	StaticResponseData,
}: {
	StaticDataArray: StaticData[];
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
	StaticResponseData: StaticData[];
}): ReactElement {
	const { isHeadOpened, dataLayout } = useExtensionStateContext();
	return (
		<div className={`static__data__wrapper ${!isHeadOpened ? 'static__data__wrapper__head__closed' : ''}`}>
			{StaticResponseData && StaticDataArray.length > 0 ? (
				<div className="static__data__content">
					{StaticDataArray.map((StaticData) => {
						const d = StaticResponseData.find((d) => d.id === StaticData.id);
						if (!d) return null;
						return (
							<StaticDataItemElement
								StaticData={d}
								key={`static__data__item__${d.id}`}
								selectedItems={selectedItems}
								setSelectedItems={setSelectedItems}
								dataLayout={dataLayout}
							/>
						);
					})}
				</div>
			) : (
				<div className="static__data__empty">
					<NoImageIcon className="static__data__empty__icon" />
					<p className="static__data__empty__label">No images was found</p>
				</div>
			)}
		</div>
	);
}

export { StaticDataElement };
