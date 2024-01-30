import { StaticData } from '../interface';

const getFileName = (StaticData: StaticData, i: number): string => {
	let name;
	if (StaticData.name !== '') name = `${StaticData.name}_${i}`;
	else if (StaticData.alt !== '') name = `${StaticData.alt}_${i}`;
	else name = `${StaticData.imageType}_${i}`;
	return `${name}.${StaticData.extension}`;
};

export { getFileName };
