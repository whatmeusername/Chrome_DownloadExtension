import { ReactElement } from 'react';
import { SortOption } from '../../interface';
import { CheckmarkIcon, DownArrowIcon, SortIcon } from '../icons';
import Dropdown from '../Dropdown/Dropdown';
import './SortElement.scss';

const SortData: SortOption[] = [
	{ id: 1, field: 'alt', orderby: 'asc', alias: 'Alt' },
	{ id: 2, field: 'alt', orderby: 'desc', alias: 'Alt' },
	{ id: 3, field: 'name', orderby: 'asc', alias: 'Name' },
	{ id: 4, field: 'name', orderby: 'desc', alias: 'Name' },
	{ id: 5, field: 'size', orderby: 'asc', alias: 'File size' },
	{ id: 6, field: 'size', orderby: 'desc', alias: 'File size' },
];

function SortElement({
	sortOption,
	setSortOption,
	disabled,
}: {
	sortOption: SortOption | null;
	setSortOption: React.Dispatch<React.SetStateAction<SortOption | null>>;
	disabled: boolean;
}): ReactElement {
	return (
		<Dropdown
			header={sortOption !== null ? sortOption.alias : 'Sort'}
			disabled={disabled}
			icon={<SortIcon className="modal__toggle__button__icon" />}
		>
			<div className="static__data__header__filter__content static__data__header__filter__allowed__sort">
				<button
					className={`static__data__header__filter__item static__data__header__filter__item__sort ${
						sortOption === null ? 'static__data__header__filter__item__active' : ''
					}`}
					onClick={() => setSortOption(null)}
				>
					<div className="static__data__header__filter__item__icon__wrapper">
						{sortOption === null ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
					</div>
					<p className="static__data__header__filter__item__label">No sorting</p>
				</button>
				{SortData.map((sortData) => {
					const isActive = sortOption !== null && sortOption.id === sortData.id;
					return (
						<button
							className={`static__data__header__filter__item static__data__header__filter__item__sort ${
								isActive ? 'static__data__header__filter__item__active' : ''
							}`}
							key={`static__data__header__filter__item__sort__${sortData.id}`}
							onClick={() => setSortOption(sortData)}
						>
							<div className="static__data__header__filter__item__icon__wrapper">
								{isActive ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
							</div>
							<p className="static__data__header__filter__item__label">{sortData.alias}</p>
							<div className="static__data__header__filter__item__icon__wrapper  static__data__header__filter__item__icon__wrapper__large">
								<DownArrowIcon
									className={`static__data__header__filter__item__icon ${
										sortData.orderby === 'asc' ? 'static__data__header__filter__item__icon__rotated' : ''
									}`}
								/>
							</div>
						</button>
					);
				})}
			</div>
		</Dropdown>
	);
}

export { SortElement };
