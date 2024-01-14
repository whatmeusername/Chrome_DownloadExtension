import { ReactElement, useRef } from 'react';
import './SizeFilter.scss';
import Dropdown from '../Dropdown/Dropdown';
import { GetAllStaticResponse } from '../../utils/getAllStaticURLS';
import { StaticDataSizeFilter } from '../../interface';

function SizeFilter({
	selectedSize,
	setSelectedSize,
	sizeData,
}: {
	selectedSize: StaticDataSizeFilter;
	setSelectedSize: React.Dispatch<React.SetStateAction<StaticDataSizeFilter>>;
	sizeData: GetAllStaticResponse['size'];
}): ReactElement | null {
	const timeout = useRef<ReturnType<typeof setTimeout>>(null!);
	const formRef = useRef<HTMLFormElement>(null!);

	const ResetFilter = (e: React.FormEvent) => {
		e.preventDefault();
		clearTimeout(timeout.current);
		setSelectedSize({ height: { min: null, max: null }, width: { min: null, max: null } });
		formRef.current.reset();
	};

	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, key: 'width' | 'height', size: 'min' | 'max') => {
		const eKey = e.code;
		const target: HTMLInputElement = e.target as HTMLInputElement;
		if (['-', '+', '.', ',', '+', 'e'].includes(eKey)) {
			e.preventDefault();
			return;
		}

		const dataValue = sizeData[key][size];
		let inputValue = Number(target.value);
		if (size === 'max' && inputValue > dataValue) {
			inputValue = dataValue;
			target.value = dataValue.toString();
		}

		clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			// TODO: FIX STATE
			setSelectedSize((prev) => {
				prev[key][size] = inputValue;
				return JSON.parse(JSON.stringify(prev));
			});
		}, 350);
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (['-', '+', '.', ',', '+', 'e'].includes(e.code)) {
			e.preventDefault();
			return;
		}
	};

	return (
		<div className="static__data__header__filter">
			<Dropdown header="Size" disabled={sizeData === undefined}>
				{sizeData ? (
					<form className="static__data__header__filter__content static__data__header__filter__allowed__size" ref={formRef}>
						<div className="size__filter__wrapper size__filter__width">
							<div className="size__filter__header__wrapper">
								<p className="size__filter__header">Width</p>
								<button onClick={ResetFilter} className="size__filter__reset__button">
									Reset size filter
								</button>
							</div>
							<div className="size__filter__wrapper__content">
								<p className="size__filter__label">from</p>
								<input
									className="size__filter__input"
									type="number"
									defaultValue={selectedSize.width.min ?? ''}
									placeholder={sizeData.width.min.toString()}
									onKeyDown={onKeyDown}
									onKeyUp={(e) => onKeyUp(e, 'width', 'min')}
								/>
								<p className="size__filter__label">to</p>
								<input
									className="size__filter__input"
									type="number"
									defaultValue={selectedSize.width.max ?? ''}
									placeholder={sizeData.width.max.toString()}
									onKeyDown={onKeyDown}
									onKeyUp={(e) => onKeyUp(e, 'width', 'max')}
								/>
							</div>
						</div>
						<hr className="size__filter__hr" />
						<div className="size__filter__wrapper size__filter__height">
							<p className="size__filter__header">Height</p>
							<div className="size__filter__wrapper__content">
								<p className="size__filter__label">from</p>
								<input
									className="size__filter__input"
									defaultValue={selectedSize.height.min ?? ''}
									type="text"
									placeholder={sizeData.height.min.toString()}
									onKeyDown={onKeyDown}
									onKeyUp={(e) => onKeyUp(e, 'height', 'min')}
								/>
								<p className="size__filter__label">to</p>
								<input
									className="size__filter__input"
									type="text"
									defaultValue={selectedSize.height.max ?? ''}
									placeholder={sizeData.height.max.toString()}
									onKeyDown={onKeyDown}
									onKeyUp={(e) => onKeyUp(e, 'height', 'max')}
								/>
							</div>
						</div>
					</form>
				) : null}
			</Dropdown>
		</div>
	);
}

export { SizeFilter };
