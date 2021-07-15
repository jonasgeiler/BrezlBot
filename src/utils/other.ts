export function removeAtSign(str: string) {
	if (str.startsWith('@')) {
		str = str.substr(1);
	}

	return str;
}

export const isNumeric = (value: any) => !isNaN(value);