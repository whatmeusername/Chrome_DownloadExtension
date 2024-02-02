import { ReactElement } from 'react';
import { StaticData } from '../../interface';
import { ChromeDownloadFile } from '../../utils/ChromeDownloadFile';
import './StaticDataElement.scss';
import { LinkIcon, NoImageIcon } from '../icons';
import { ThinLineElement } from '../shared/ThinLineElement';
import { CalculateFileSize } from '../../utils/CalculateFileSize';

function OpenAtNewTab({ StaticData }: { StaticData: StaticData }): ReactElement {
	if (StaticData.type === 'data') {
		const onClick = () => {
			const cw = window.open();
			cw?.document.write(`<img src="${StaticData.src}"/>`);
		};

		return (
			<button onClick={onClick} className="static__data__item__img__info__item static__data__item__img__info__item__link">
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
function StaticDataItemElement({
	StaticData,
	selectedItems,
	setSelectedItems,
}: {
	StaticData: StaticData;
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
}): ReactElement {
	const activeIndex = selectedItems.findIndex((i) => i.src === StaticData.src);

	const SetItemActive = () => {
		if (activeIndex !== -1) {
			setSelectedItems(selectedItems.filter((i) => i.src !== StaticData.src));
		} else {
			setSelectedItems([...selectedItems, StaticData]);
		}
	};

	return (
		<div className={`static__data__item ${activeIndex !== -1 ? 'static__data__item__active' : ''}`}>
			<div className="static__data__item__content">
				<div className="static__data__item__img__wrapper" onClick={SetItemActive}>
					<div className="static__data__item__img__info">
						<div className="static__data__item__img__info__item static__data__item__img__info__item__extension">{StaticData.extension}</div>
						<SizeElement fileSize={StaticData.size} />
						<DimensionElement StaticData={StaticData} />
						<OpenAtNewTab StaticData={StaticData} />
					</div>
					<img className="static__data__item__img" src={StaticData.src} alt={StaticData.alt ?? undefined} />
				</div>
				<div className="static__data__item__info">
					<ThinLineElement />
					<a className="static__data__item__label__href" target="_blank" href={StaticData.src} title={StaticData.src}>
						<p className="static__data__item__label__href__text">{StaticData.src}</p>
					</a>
					<div className="static__data__item__names">
						<p className="static__data__item__names__label" title={StaticData?.name ?? 'Name is empty'}>
							Name: {StaticData.name === '' ? 'None' : StaticData.name}
						</p>
						<p className="static__data__item__names__label" title={StaticData?.alt ?? 'Alt is empty'}>
							Alt: {StaticData.alt === '' ? 'None' : StaticData.alt}
						</p>
					</div>
					<div className="static__data__item__buttons">
						<button className="static__data__item__button static__data__item__button__download" onClick={() => ChromeDownloadFile(StaticData)}>
							Download file
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
}: {
	StaticDataArray: StaticData[];
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
}): ReactElement {
	return (
		<div className="static__data__wrapper">
			{StaticDataArray.length > 0 ? (
				<div className="static__data__content">
					{StaticDataArray.map((StaticData, i) =>
						StaticData ? (
							<StaticDataItemElement
								StaticData={StaticData}
								key={`static__data__item__${i}`}
								selectedItems={selectedItems}
								setSelectedItems={setSelectedItems}
							/>
						) : null,
					)}
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
