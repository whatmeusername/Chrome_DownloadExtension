import JSZip from 'jszip';
import { StaticData } from '../interface';

const CollectZip = async (StaticData: StaticData[]): Promise<string> => {
	const getFileName = (StaticData: StaticData, i: number): string => {
		let name;
		if (StaticData.name !== '') name = `${StaticData.name}_${i}`;
		else if (StaticData.alt !== '') name = `${StaticData.alt}_${i}`;
		else name = `${StaticData.imageType}_${i}`;
		return `${name}.${StaticData.extension}`;
	};

	const zip = new JSZip();
	for (let i = 0; i < StaticData.length; i++) {
		const isDataURL = StaticData[i].type === 'data' && StaticData[i].src.startsWith('data');
		let blobOrData = StaticData[i].type === 'data' ? StaticData[i].src : StaticData[i].blob;
		if (blobOrData) {
			if (isDataURL) {
				blobOrData = await fetch(blobOrData as string).then((res) => res.blob());
			}
			if (!blobOrData) continue;
			zip.file(getFileName(StaticData[i], i), blobOrData);
		}
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
