import { ReactElement } from 'react';
import { StaticData } from '../../../../interface';
import { ChromeDownloadFile } from '../../../../utils/ChromeDownloadFile';
import { DownloadIcon } from '../../../icons';

function DownloadSelectedFilesButton({ selectedItems }: { selectedItems: StaticData[] }): ReactElement {
	return (
		<button
			className={`extension__main__head__selection__download__all ${
				selectedItems.length === 0
					? 'extension__main__head__selection__download__all__disabled'
					: 'extension__main__head__selection__download__all__acitve'
			}`}
			disabled={selectedItems.length === 0}
			onClick={selectedItems.length === 0 ? undefined : () => ChromeDownloadFile(selectedItems)}
		>
			<DownloadIcon className="extension__main__head__selection__download__all__icon" />
			<p className="extension__main__head__selection__download__all__label">Download selected</p>
		</button>
	);
}

export { DownloadSelectedFilesButton };
