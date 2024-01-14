import { ReactElement } from 'react';
import './ExtensionFilter.scss';
import Dropdown from '../Dropdown/Dropdown';
import { CheckmarkIcon } from '../icons';

function ExtensionFilter({
	selectedExtension,
	setSelectedExtension,
	extensionData,
}: {
	selectedExtension: string[];
	setSelectedExtension: React.Dispatch<React.SetStateAction<string[]>>;
	extensionData?: { [K: string]: number };
}): ReactElement {
	const HandleClick = (extension: string | null): void => {
		if (extension === null) {
			setSelectedExtension([]);
			return;
		}
		const index = selectedExtension.findIndex((e) => e === extension);
		if (index !== -1) {
			selectedExtension.splice(index, 1);
			setSelectedExtension([...selectedExtension]);
		} else {
			setSelectedExtension([...selectedExtension, extension]);
		}
	};

	const extensionCountPairs = extensionData ? Object.entries(extensionData) : [];
	return (
		<div className="static__data__header__filter">
			<Dropdown header="Extension" disabled={extensionData === undefined}>
				<div className="static__data__header__filter__content static__data__header__filter__allowed__extensions">
					<button
						className={`static__data__header__filter__item static__data__header__filter__item__extension ${
							selectedExtension.length === 0 ? 'static__data__header__filter__item__active' : ''
						}`}
						onClick={() => HandleClick(null)}
					>
						<div className="static__data__header__filter__item__icon__wrapper">
							{selectedExtension.length === 0 ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
						</div>
						<p className="static__data__header__filter__item__label">All</p>
					</button>
					{extensionCountPairs.map(([extension, count]) => {
						return (
							<button
								className={`static__data__header__filter__item static__data__header__filter__item__extension ${
									selectedExtension.includes(extension) ? 'static__data__header__filter__item__active' : ''
								}`}
								key={`static__data__header__filter__item__extension__${extension}`}
								onClick={() => HandleClick(extension)}
							>
								<div className="static__data__header__filter__item__icon__wrapper">
									{selectedExtension.includes(extension) ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
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

export { ExtensionFilter };
