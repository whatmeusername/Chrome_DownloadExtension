import { ReactElement, useRef } from 'react';
import { useFilterContext } from '../FilterContext/FilterContext';
import { SearchData } from '../../interface';
import Dropdown from '../Dropdown/Dropdown';
import { CheckmarkIcon } from '../icons';
import './SearchElement.scss';

const SearchDataFields: { field: 'src' | 'name' | 'alt'; alias: string }[] = [
	{ field: 'src', alias: 'url' },
	{ field: 'name', alias: 'name' },
	{ field: 'alt', alias: 'alt' },
];

function SearchOptionSelect({
	searchData,
	setSearchData,
}: {
	searchData: SearchData;
	setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
}) {
	return (
		<Dropdown header={`Search by ${searchData.field}`}>
			<div className="static__data__header__filter__content static__data__header__filter__allowed__sort">
				{SearchDataFields.map((searchField) => {
					const isActive = searchField.field === searchData?.field;
					return (
						<button
							className={`static__data__header__filter__item static__data__header__filter__item__sort ${
								isActive ? 'static__data__header__filter__item__active' : ''
							}`}
							key={`static__data__header__filter__item__sort__${searchField.field}`}
							onClick={() => setSearchData({ str: searchData?.str ?? '', field: searchField.field })}
						>
							<div className="static__data__header__filter__item__icon__wrapper">
								{isActive ? <CheckmarkIcon className="static__data__header__filter__item__icon" /> : null}
							</div>
							<p className="static__data__header__filter__item__label">{searchField.alias}</p>
						</button>
					);
				})}
			</div>
		</Dropdown>
	);
}

function SearchElement(): ReactElement {
	const { searchData, setSearchData } = useFilterContext();

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

	const OnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const value = (e.target as HTMLInputElement).value.trim();

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			setSearchData({ ...searchData, str: value });
		}, 400);
	};

	return (
		<div className="search__filter__wrapper">
			<div className="search__filter__input__wrapper">
				<input
					type="text"
					className="search__filter__input"
					placeholder={searchData ? `Search images by ${searchData.field}` : 'Search images'}
					onKeyUp={OnInput}
				/>
				<SearchOptionSelect searchData={searchData} setSearchData={setSearchData} />
			</div>
		</div>
	);
}

export { SearchElement };
