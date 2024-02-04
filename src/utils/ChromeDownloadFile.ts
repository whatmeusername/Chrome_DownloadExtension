import JSZip from 'jszip';
import { StaticData } from '../interface';
import { getFileName } from './getFileName';

const CollectZip = async (StaticData: StaticData[]): Promise<string> => {
	const zip = new JSZip();
	for (let i = 0; i < StaticData.length; i++) {
		let blob: Blob | string | null = StaticData[i].type === 'data' ? StaticData[i].src : null;
		if (blob === null) {
			blob = await (await fetch(StaticData[i].src)).blob();
		}
		zip.file(getFileName(StaticData[i], i), blob);
	}
	const zipContent = await zip.generateAsync({ type: 'blob' });
	return URL.createObjectURL(zipContent);
};

function ChromeDownloadJson(StaticData: StaticData[]) {
	const copyJson: Partial<StaticData>[] = JSON.parse(JSON.stringify(StaticData)).map;
	for (let i = 0; i < copyJson.length; i++) {
		delete copyJson[i].id;
	}
	const bytes = new TextEncoder().encode(JSON.stringify(copyJson));

	const blob = new Blob([bytes], {
		type: 'application/json;charset=utf-8',
	});

	chrome.downloads.download({
		url: URL.createObjectURL(blob),
	});
}

const ChromeDownloadFile = async (StaticData: StaticData | StaticData[]): Promise<void> => {
	if (Array.isArray(StaticData)) {
		if (StaticData.length > 5) {
			chrome.downloads.download({
				filename: 'ImagesZip',
				url: await CollectZip(StaticData),
			});
		} else {
			for (let i = 0; i < StaticData.length; i++) {
				chrome.downloads.download({
					filename: getFileName(StaticData[i], i),
					url: StaticData[i].src,
				});
			}
		}
	} else {
		chrome.downloads.download({
			saveAs: false,
			filename: getFileName(StaticData),
			url: StaticData.src,
		});
	}
};

export { ChromeDownloadFile, ChromeDownloadJson };
