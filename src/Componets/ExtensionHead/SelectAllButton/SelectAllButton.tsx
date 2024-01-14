import { ReactElement } from 'react';
import { StaticData } from '../../../interface';
import './SelectAllButton.scss';

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
		<button className="static__data__select__all__button" onClick={OnClick}>
			{selectedItems.length > 0 ? 'Unselect all' : 'Select all'}
		</button>
	);
}

export { SelectAllButton };
