import { StaticData } from '../interface';

const downloadImage = (StaticData: StaticData): void => {
	chrome.downloads.download({
		url: StaticData.src,
	});
};

export { downloadImage };
