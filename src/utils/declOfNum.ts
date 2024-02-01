function declOfNum(n: number | undefined | null, forms: string[]) {
	if (n === undefined || n === null) return '';

	n = Math.abs(n) % 100;
	const n1 = n % 10;
	if (n > 10 && n < 20) {
		return forms[forms.length === 3 ? 2 : 1];
	} else if (n1 > 1 && n1 < 5) {
		return forms[1];
	} else if (n1 === 1) {
		return forms[0];
	}
	return forms[forms.length === 3 ? 2 : 1];
}

export { declOfNum };
