import { ReactElement } from 'react';
import { StaticData } from '../../../interface';
import './SelectAllButton.scss';
import { SelectIcon } from '../../icons';

function SelectAllButton({
	StaticDataArray,
	selectedItems,
	setSelectedItems,
}: {
	StaticDataArray: StaticData[];
	selectedItems: StaticData[];
	setSelectedItems: React.Dispatch<React.SetStateAction<StaticData[]>>;
}): ReactElement {
	const OnClick = () => {
		if (selectedItems.length > 0) {
			setSelectedItems([]);
		} else {
			setSelectedItems(StaticDataArray);
		}
	};
	return (
		<button
			className={`static__data__select__all__button ${
				!StaticDataArray || StaticDataArray.length === 0
					? 'static__data__select__all__button__disabled'
					: 'static__data__select__all__button__enabled'
			} `}
			onClick={StaticDataArray && StaticDataArray.length > 0 ? OnClick : undefined}
		>
			<SelectIcon className="static__data__select__all__button__icon" />
			<p className="static__data__select__all__button__label">{selectedItems.length > 0 ? 'Unselect all' : 'Select all'}</p>
		</button>
	);
}

export { SelectAllButton };
