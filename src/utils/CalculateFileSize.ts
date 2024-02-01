function CalculateFileSize(fileSize: number | null): { size: number; unit: string } {
	let size = 0;
	let unit = '';
	if (fileSize) {
		if (fileSize / 1024 > 1) {
			size = Number((fileSize / 1024).toFixed(2));
			unit = 'KB';
			if (Math.floor(size / 1024) > 1) {
				size = Number((size / 1024).toFixed(2));
				unit = 'MB';
			}
		} else {
			unit = 'B';
			size = fileSize;
		}
	}

	return { size, unit };
}

export { CalculateFileSize };
