import { ReactElement } from 'react';
import { StaticData } from '../../../interface';
import { useFilterContext } from '../../FilterContext/FilterContext';
import { SelectAllButton } from '../SelectAllButton/SelectAllButton';

import './HeadSelectionElement.scss';

function HeadSelectionElement({ StaticDataResult }: { StaticDataResult: StaticData[] }): ReactElement {
	const { selectedItems, setSelectedItems } = useFilterContext();

	return (
		<div className="extension__main__head__selection">
			<SelectAllButton StaticDataArray={StaticDataResult} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
			<p className="extension__main__head__selection__label">
				Selected {selectedItems.length} of {StaticDataResult?.length ?? 0} files
			</p>
		</div>
	);
}

export { HeadSelectionElement };
