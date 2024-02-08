import { ReactElement, useRef } from 'react';
import { useFilterContext } from '../FilterContext/FilterContext';
import { GetAllStaticResponse, SearchData } from '../../interface';
import Dropdown from '../Dropdown/Dropdown';
import { CheckmarkIcon } from '../icons';
import './SearchElement.scss';
import { ToggleHeadButton } from '../ExtensionHead/OpenHeadButton/OpenHeadButton';
import { ChangeLayoutButton } from '../ExtensionHead/ChangeLayoutButton/ChangeLayoutButton';

const SearchDataFields: { field: 'src' | 'name' | 'alt'; alias: string }[] = [
	{ field: 'src', alias: 'url' },
	{ field: 'name', alias: 'name' },
	{ field: 'alt', alias: 'alt' },
];

function SearchOptionSelect({
	searchData,
	setSearchData,
	disabled,
}: {
	searchData: SearchData;
	setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
	disabled: boolean;
}) {
	return (
		<Dropdown header={`Search by ${searchData.field}`} disabled={disabled}>
			<div className="static__data__header__filter__content static__data__header__filter__allowed__search">
				{SearchDataFields.map((searchField) => {
					const isActive = searchField.field === searchData?.field;
					return (
						<button
							className={`static__data__header__filter__item static__data__header__filter__item__search ${
								isActive ? 'static__data__header__filter__item__active' : ''
							}`}
							key={`static__data__header__filter__item__search__${searchField.field}`}
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

function SearchElement({ StaticResponseData }: { StaticResponseData: GetAllStaticResponse }): ReactElement {
	const { searchData, setSearchData } = useFilterContext();

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

	const OnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const value = (e.target as HTMLInputElement).value.trim();

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			setSearchData({ ...searchData, str: value });
		}, 400);
	};

	const isDisabled = StaticResponseData === null || StaticResponseData.data?.length === 0;

	return (
		<div className="search__filter__wrapper">
			<div className="search__filter__input__wrapper">
				<input
					type="text"
					className="search__filter__input"
					placeholder={searchData ? `Search images by ${searchData.field}` : 'Search images'}
					onKeyUp={isDisabled ? undefined : OnInput}
					disabled={isDisabled}
				/>
				<SearchOptionSelect searchData={searchData} setSearchData={setSearchData} disabled={isDisabled} />
			</div>
			<div className="search__filter__settings">
				<ChangeLayoutButton />
				<ToggleHeadButton isClose={true} />
			</div>
		</div>
	);
}

export { SearchElement };
