import { ReactElement } from 'react';
import { StaticData } from '../../../../interface';
import { ChromeDownloadJson } from '../../../../utils/ChromeDownloadFile';
import { JsonIcon } from '../../../icons';

function DownloadJsonDataButton({ StaticDataResult, selectedItems }: { StaticDataResult: StaticData[]; selectedItems: StaticData[] }): ReactElement {
	const selectedDataToJson = (selectedItems?.length > 0 ? selectedItems : StaticDataResult) ?? [];
	return (
		<button
			className={`extension__main__head__selection__download__all ${
				selectedDataToJson.length === 0
					? 'extension__main__head__selection__download__all__disabled'
					: 'extension__main__head__selection__download__all__acitve'
			}`}
			disabled={selectedDataToJson.length === 0}
			onClick={selectedDataToJson.length === 0 ? undefined : () => ChromeDownloadJson(selectedDataToJson)}
		>
			<JsonIcon className="extension__main__head__selection__download__all__icon" />
			<p className="extension__main__head__selection__download__all__label">Download as JSON</p>
		</button>
	);
}

export { DownloadJsonDataButton };
