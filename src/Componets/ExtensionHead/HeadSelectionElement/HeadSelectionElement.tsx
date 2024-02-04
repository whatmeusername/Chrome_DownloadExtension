import { ReactElement } from 'react';
import { StaticData } from '../../../interface';
import { useFilterContext } from '../../FilterContext/FilterContext';
import { SelectAllButton } from '../SelectAllButton/SelectAllButton';

import { DownloadJsonDataButton } from './DownloadJsonDataButton/DownloadJsonDataButton';
import { DownloadSelectedFilesButton } from './DownloadSelectedFilesButton/DownloadSelectedFilesButton';
import './HeadSelectionElement.scss';

function HeadSelectionElement({ StaticDataResult }: { StaticDataResult: StaticData[] }): ReactElement {
	const { selectedItems, setSelectedItems } = useFilterContext();

	return (
		<div className="extension__main__head__selection">
			<div className="extension__main__head__selection__left">
				<SelectAllButton StaticDataArray={StaticDataResult} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
				<DownloadSelectedFilesButton selectedItems={selectedItems} />

				<p className="extension__main__head__selection__label">
					Selected {selectedItems.length} of {StaticDataResult?.length ?? 0} files
				</p>
			</div>
			<div className="extension__main__head__selection__right">
				<DownloadJsonDataButton StaticDataResult={StaticDataResult} selectedItems={selectedItems} />
			</div>
		</div>
	);
}

export { HeadSelectionElement };
