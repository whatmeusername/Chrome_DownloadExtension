import { ReactElement } from 'react';
import { StaticData } from '../../../interface';
import { useFilterContext } from '../../FilterContext/FilterContext';
import { SelectAllButton } from '../SelectAllButton/SelectAllButton';

import './HeadSelectionElement.scss';
import { ChromeDownloadFile } from '../../../utils/ChromeDownloadFile';

function HeadSelectionElement({ StaticDataResult }: { StaticDataResult: StaticData[] }): ReactElement {
	const { selectedItems, setSelectedItems } = useFilterContext();

	return (
		<div className="extension__main__head__selection">
			<div className="extension__main__head__selection__left">
				<SelectAllButton StaticDataArray={StaticDataResult} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
				<p className="extension__main__head__selection__label">
					Selected {selectedItems.length} of {StaticDataResult?.length ?? 0} files
				</p>
			</div>
			<div className="extension__main__head__selection__right">
				<button
					className={`extension__main__head__selection__download__all ${
						selectedItems.length === 0
							? 'extension__main__head__selection__download__all__disabled'
							: 'extension__main__head__selection__download__all__acitve'
					}`}
					disabled={selectedItems.length === 0}
					onClick={selectedItems.length === 0 ? undefined : () => ChromeDownloadFile(selectedItems)}
				>
					<p className="extension__main__head__selection__download__all__label">Download</p>
				</button>
			</div>
		</div>
	);
}

export { HeadSelectionElement };
