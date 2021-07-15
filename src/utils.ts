import type { Message, User } from 'node-telegram-bot-api';
import TelegramBot, { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import config from './config';
import { Chats } from './stores';

export function scheduleJob(time: number | string, job: Function) {
	let millis: number;

	if (typeof time === 'number') {
		millis = time;
	} else {
		if (isNumeric(time)) {
			millis = parseInt(time);
		} else {
			const num = parseInt(time.slice(0, -1));
			const unit = time.substr(-1);

			if (unit === 's') {
				millis = num * 1000;
			} else if (unit === 'm') {
				millis = num * 60 * 1000;
			} else if (unit === 'h') {
				millis = num * 60 * 60 * 1000;
			} else {
				millis = num;
			}
		}
	}

	console.log(`Job scheduled for every ${millis}ms (${time})`);

	setInterval(job, millis);
}

export function commandRegex(command: string, args: string[] = []) {
	let regex = `^\\/${command}(?:@${config.bot.username})?`;

	if (args.length > 0) {
		for (let arg of args) {
			if (arg === 'number') {
				regex += ' (\\d+)';
			} else {
				regex += ' (.+)';
			}
		}
	}

	regex += '$';

	return new RegExp(regex);
}

export function storeUser(chatId: number, user: User) {
	if (user.is_bot) return;

	const members = Chats.get(chatId.toString(), 'members');

	let name = '';

	if (user.username) {
		name = '@' + user.username;
	} else {
		if (user.last_name) {
			name = user.first_name + ' ' + user.last_name;
		} else {
			name = user.first_name;
		}
	}

	if (!members[user.id]) {
		// Add member
		members[user.id] = {
			id:     user.id,
			brezls: config.defaultBrezls,
			name,
		};
	} else if (members[user.id].name !== name) {
		// Update name
		members[user.id].name = name;
	} else {
		// Don't do anything
		return;
	}

	// Update members
	Chats.set(chatId.toString(), members, 'members');
}

interface SendMessageOptions {
	/**
	 * Remove after some time when autoHide is enabled or with a inline button
	 * @default true
 	 */
	remove?: boolean,

	/**
	 * Reply to Message
	 * @default true
	 */
	reply?: boolean,

	/**
	 * Respond to message in private
	 * @default false
	 */
	private?: boolean,
}

export async function sendMessage(bot: TelegramBot, msg: Message, text: string, comment: string = '', options: SendMessageOptions = {}) {
	const settings = Chats.get(msg.chat.id.toString(), 'settings');

	options.remove ??= true; // Remove per default
	options.reply ??= true; // Reply per default
	options.private ??= false; // Don't write private message per default

	if (comment && !settings.sendLess) {
		text += `\n\n<code>${comment}</code>`;
	}

	let reply_markup: InlineKeyboardMarkup | undefined;
	if (options.remove && !settings.autoHide) {
		reply_markup = {
			inline_keyboard: [
				[
					{
						text:          'Bassd',
						callback_data: `brezlbot_delete_msg`,
					},
				],
			],
		};
	}

	let reply_to_message_id: number | undefined;
	if (options.reply) {
		reply_to_message_id = msg.message_id;
	}

	const chatId = options.private ? msg.from!.id : msg.chat.id;

	const sentMsg = await bot.sendMessage(
		chatId,
		text,
		{
			parse_mode:           'HTML',
			disable_notification: true,
			reply_to_message_id,
			reply_markup,
		},
	);

	if (options.remove && settings.autoHide) {
		setTimeout(
			async () => {
				await bot.deleteMessage(chatId, sentMsg.message_id.toString());
			},
			settings.autoHideDelay * 60 * 1000,
		);
	}
}

export function isNumeric(value: any) {
	return !isNaN(value);
}

export function isGroupMessage(msg: Message) {
	return msg.chat.type === 'group' || msg.chat.type === 'supergroup';
}

export function isPrivateMessage(msg: Message) {
	return msg.chat.type === 'private';
}

export function isFromUser(msg: Message) {
	return msg.from && !msg.from.is_bot;
}

export function isForwarded(msg: Message) {
	return msg.forward_from;
}

export function removeAtSign(str: string) {
	if (str.startsWith('@')) {
		str = str.substr(1);
	}

	return str;
}