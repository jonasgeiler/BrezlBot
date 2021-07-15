import config from '../config';

export function commandRegex(command: string, args: string[] = []) {
	let regex = `^\\/${command}(?:@${config.bot.username})?`;

	for (let arg of args) {
		if (arg === 'number') {
			regex += ' (\\d+)';
		} else {
			regex += ' (.+)';
		}
	}

	regex += '$';

	return new RegExp(regex);
}