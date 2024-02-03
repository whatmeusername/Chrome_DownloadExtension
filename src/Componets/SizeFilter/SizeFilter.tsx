import { ReactElement, useRef } from 'react';
import './SizeFilter.scss';
import Dropdown from '../Dropdown/Dropdown';
import { GetAllStaticResponse } from '../../utils/getAllStaticURLS';
import { StaticDataSizeFilter } from '../../interface';
import { ThinLineElement } from '../shared/ThinLineElement';
import { SizeIcon } from '../icons';

const isDisableSizeFilter = (sizeData: GetAllStaticResponse['size']): boolean => {
	return sizeData.height.max === null && sizeData.height.min === null && sizeData.width.min === null && sizeData.width.max === null;
};

function SizeFilter({
	selectedSize,
	setSelectedSize,
	sizeData,
}: {
	selectedSize: StaticDataSizeFilter;
	setSelectedSize: React.Dispatch<React.SetStateAction<StaticDataSizeFilter>>;
	sizeData: GetAllStaticResponse['size'];
}): ReactElement | null {
	const formRef = useRef<HTMLFormElement>(null!);

	const ResetFilter = (e: React.FormEvent) => {
		e.preventDefault();
		setSelectedSize({ height: { min: null, max: null }, width: { min: null, max: null } });
		formRef.current.reset();
	};

	const OnFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(formRef.current);
		let minWidth = formData.get('width_min') ? Number(formData.get('width_min')) : null;
		let maxWidth = formData.get('width_max') ? Number(formData.get('width_max')) : null;
		let minHeight = formData.get('height_min') ? Number(formData.get('height_min')) : null;
		let maxHeight = formData.get('height_max') ? Number(formData.get('height_max')) : null;

		minWidth = minWidth !== null && minWidth < sizeData.width.min ? sizeData.width.min : minWidth;
		maxWidth = maxWidth !== null && maxWidth > sizeData.width.max ? sizeData.width.max : maxWidth;

		minHeight = minHeight !== null && minHeight < sizeData.height.min ? sizeData.height.min : minHeight;
		maxHeight = maxHeight !== null && maxHeight < sizeData.height.max ? sizeData.height.max : maxHeight;

		setSelectedSize({ width: { min: minWidth, max: maxWidth }, height: { min: minHeight, max: maxHeight } });
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (['-', '+', '.', ',', '+', 'e'].includes(e.code)) {
			e.preventDefault();
			return;
		}
	};

	const isDisabled = sizeData === undefined || isDisableSizeFilter(sizeData);
	return (
		<div className="static__data__header__filter">
			<Dropdown header="Size" disabled={isDisabled} icon={<SizeIcon className="modal__toggle__button__icon" />}>
				{!isDisabled ? (
					<form className="static__data__header__filter__content static__data__header__filter__allowed__size" ref={formRef}>
						<div className="size__filter__wrapper size__filter__width">
							<div className="size__filter__header__wrapper">
								<p className="size__filter__header">Width</p>
							</div>
							<div className="size__filter__wrapper__content">
								<p className="size__filter__label">from</p>
								<input
									className="size__filter__input"
									type="number"
									name="width_min"
									defaultValue={selectedSize.width.min ?? ''}
									placeholder={sizeData.width.min.toString()}
									onKeyDown={onKeyDown}
								/>
								<p className="size__filter__label">to</p>
								<input
									className="size__filter__input"
									type="number"
									name="width_max"
									defaultValue={selectedSize.width.max ?? ''}
									placeholder={sizeData.width.max.toString()}
									onKeyDown={onKeyDown}
								/>
							</div>
						</div>
						<ThinLineElement />
						<div className="size__filter__wrapper size__filter__height">
							<p className="size__filter__header">Height</p>
							<div className="size__filter__wrapper__content">
								<p className="size__filter__label">from</p>
								<input
									className="size__filter__input"
									defaultValue={selectedSize.height.min ?? ''}
									type="text"
									name="height_min"
									placeholder={sizeData.height.min.toString()}
									onKeyDown={onKeyDown}
								/>
								<p className="size__filter__label">to</p>
								<input
									className="size__filter__input"
									type="text"
									name="height_max"
									defaultValue={selectedSize.height.max ?? ''}
									placeholder={sizeData.height.max.toString()}
									onKeyDown={onKeyDown}
								/>
							</div>
						</div>
						<div className="size__filter__buttons__wrapper">
							<button onClick={OnFormSubmit} className="size__filter__button">
								<p className="size__filter__button__label">Apply filter</p>
							</button>
							<button onClick={ResetFilter} className="size__filter__button">
								<p className="size__filter__button__label">Reset filter</p>
							</button>
						</div>
					</form>
				) : null}
			</Dropdown>
		</div>
	);
}

export { SizeFilter };
