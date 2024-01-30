import JSZip from 'jszip';
import { StaticData } from '../interface';
import { getFileName } from './getFileName';

const CollectZip = async (StaticData: StaticData[]): Promise<string> => {
	const zip = new JSZip();
	for (let i = 0; i < StaticData.length; i++) {
		zip.file(getFileName(StaticData[i], i), StaticData[i].blob);
	}
	const zipContent = await zip.generateAsync({ type: 'blob' });
	return URL.createObjectURL(zipContent);
};

const ChromeDownloadFile = async (StaticData: StaticData | StaticData[]): Promise<void> => {
	if (Array.isArray(StaticData)) {
		if (StaticData.length > 5) {
			chrome.downloads.download({
				url: await CollectZip(StaticData),
			});
		} else {
			for (let i = 0; i < StaticData.length; i++) {
				chrome.downloads.download({
					url: StaticData[i].src,
				});
			}
		}
	} else {
		chrome.downloads.download({
			url: StaticData.src,
		});
	}
};

export { ChromeDownloadFile };
