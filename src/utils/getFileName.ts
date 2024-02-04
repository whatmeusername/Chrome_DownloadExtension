import { StaticData } from '../interface';

const getFileName = (StaticData: StaticData, i?: number): string => {
	const fn = StaticData.name;
	const fa = StaticData.alt;
	let name;
	if (i === undefined) {
		name = `${fn ? fn : fa ? fa : 'unnamed'}`;
	} else if (fn !== '') name = `${fn}_${i}`;
	else if (fa !== '') name = `${fa}_${i}`;
	else name = `${StaticData.imageType}_${i}`;
	return `${name}.${StaticData.extension}`;
};

export { getFileName };
