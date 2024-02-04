import { ReactElement } from 'react';
import './LayoutFilter.scss';
import Dropdown from '../Dropdown/Dropdown';
import { CheckmarkIcon, LayoutIcon } from '../icons';
import { StaticImageLayout } from '../../interface';

function LayoutFilter({
	selectedLayout,
	setSelectedLayout,
	layoutData,
}: {
	selectedLayout: string[];
	setSelectedLayout: React.Dispatch<React.SetStateAction<string[]>>;
	layoutData?: { [K: string]: number };
}): ReactElement {
	const HandleClick = (layout: string | null): void => {
		if (layout === null) {
			setSelectedLayout([]);
			return;
		}
		const index = selectedLayout.findIndex((e) => e === layout);
		if (index !== -1) {
			selectedLayout.splice(index, 1);
			setSelectedLayout([...selectedLayout]);
		} else {
			setSelectedLayout([...selectedLayout, layout]);
		}
	};

	const extensionCountPairs = layoutData ? Object.entries(layoutData) : [];

	return (
		<div className="static__data__header__filter">
			<Dropdown header="Layout" disabled={layoutData === undefined} icon={<LayoutIcon className="modal__toggle__button__icon" />}>
				<div className="static__data__header__filter__content static__data__header__filter__allowed__layout">
					<button
						className={`static__data__header__filter__item static__data__header__filter__item__layout ${
							selectedLayout.length === 0 ? 'static__data__header__filter__item__active' : ''
						}`}
						onClick={() => HandleClick(null)}
					>
						<div className="static__data__header__filter__item__icon__wrapper">
							{selectedLayout.length === 0 ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
						</div>
						<p className="static__data__header__filter__item__label">All</p>
					</button>
					{extensionCountPairs.map(([extension, count]) => {
						if (extension === StaticImageLayout.ALL) return null;
						return (
							<button
								className={`static__data__header__filter__item static__data__header__filter__item__layout ${
									selectedLayout.includes(extension) ? 'static__data__header__filter__item__active' : ''
								}`}
								key={`static__data__header__filter__item__layout__${extension}`}
								onClick={() => HandleClick(extension)}
							>
								<div className="static__data__header__filter__item__icon__wrapper">
									{selectedLayout.includes(extension) ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
								</div>
								<p className="static__data__header__filter__item__label">{extension}</p>
								<p className="static__data__header__filter__item__count">({count})</p>
							</button>
						);
					})}
				</div>
			</Dropdown>
		</div>
	);
}

export { LayoutFilter };
