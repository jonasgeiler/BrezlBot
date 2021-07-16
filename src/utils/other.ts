export function removeAtSign(str: string): string {
	if (str.startsWith('@')) {
		str = str.substr(1);
	}

	return str;
}

export function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const isNumeric = (value: any): boolean => !isNaN(value);