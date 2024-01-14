import { ReactElement } from 'react';
import { StaticData } from '../../interface';
import { downloadImage } from '../../utils/downloadFiles';
import './StaticDataElement.scss';
import { LinkIcon } from '../icons';

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
	let size, sizeUnit;
	if (StaticData.size !== null) {
		if (Math.floor(StaticData.size / 1024) > 0) {
			size = Math.floor(StaticData.size / 1024);
			sizeUnit = 'KB';
			if (Math.floor(size / 1024) > 0) {
				size = Math.floor(StaticData.size / 1024);
				sizeUnit = 'MB';
			}
		} else {
			sizeUnit = 'B';
			size = StaticData.size;
		}
	}

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
						<div className="static__data__item__img__info__item static__data__item__img__info__item__size">
							{size} {sizeUnit}
						</div>
						{StaticData.type === 'src' ? (
							<div className="static__data__item__img__info__item static__data__item__img__info__item__sizes">
								{StaticData.width}x{StaticData.height}
							</div>
						) : null}
						<OpenAtNewTab StaticData={StaticData} />
					</div>
					<img className="static__data__item__img" src={StaticData.src} alt={StaticData.alt ?? undefined} />
				</div>
				<div className="static__data__item__info">
					<hr className="static__data__item__info__hr" />
					<p className="static__data__item__label">{StaticData.alt ?? StaticData.name}</p>
					<div className="static__data__item__buttons">
						<button className="static__data__item__button static__data__item__button__download" onClick={() => downloadImage(StaticData)}>
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
	);
}

export { StaticDataElement };
