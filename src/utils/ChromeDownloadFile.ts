import { StaticData } from '../interface';

const ChromeDownloadFile = (StaticData: StaticData | StaticData[]): void => {
	if (Array.isArray(StaticData)) {
		for (let i = 0; i < StaticData.length; i++) {
			chrome.downloads.download({
				url: StaticData[i].src,
			});
		}
	} else {
		chrome.downloads.download({
			url: StaticData.src,
		});
	}
};

export { ChromeDownloadFile };
