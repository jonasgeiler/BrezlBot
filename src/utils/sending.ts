import TelegramBot, { InlineKeyboardMarkup, Message } from 'node-telegram-bot-api';
import { Chats } from '../stores';
import { wait } from './other';

interface SendMessageOptions {
	/**
	 * Remove after some time when autoHide is enabled or with a inline button
	 * @default true
	 */
	remove?: boolean,

	/**
	 * Remove Button text
	 * @default "Bassd"
	 */
	removeButtonText?: string,

	/**
	 * User ID who can remove the message
	 * False to disable
	 * @default msg.from.id
	 */
	removeAllowedId?: number | boolean

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

export async function sendMessage(bot: TelegramBot, msg: Message, text: string, comment: string = '', options: SendMessageOptions = {}): Promise<Message> {
	options.remove ??= true; // Remove per default
	options.removeButtonText ??= 'Bassd'; // Remove per default
	options.removeAllowedId ??= msg.from!.id; // Can be removed by user who sent the request by default
	options.reply ??= true; // Reply per default
	options.private ??= false; // Don't write private message per default

	// Use default options in private chat
	const settings = !options.private ? Chats.get(msg.chat.id.toString(), 'settings') : {
		sendLess:      false,
		autoHide:      false,
		autoHideDelay: 15,
	};

	if (comment && !settings.sendLess) {
		text += `\n\n<code>${comment}</code>`;
	}

	let reply_markup: InlineKeyboardMarkup | undefined;
	if (options.remove && !settings.autoHide) {
		const callback_data = 'brezlbot_confirm_msg' + (options.removeAllowedId ? `:${options.removeAllowedId}` : '');

		reply_markup = {
			inline_keyboard: [
				[
					{
						text: options.removeButtonText,
						callback_data,
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
		await wait(settings.autoHideDelay * 60 * 1000);
		await bot.deleteMessage(chatId, sentMsg.message_id.toString());
	}

	return sentMsg;
}