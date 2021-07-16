export function removeAtSign(str: string): string {
	if (str.startsWith('@')) {
		str = str.substr(1);
	}

	return str;
}

export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const isNumeric = (value: any): boolean => !isNaN(value);

export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}