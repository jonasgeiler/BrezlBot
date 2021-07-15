import TelegramBot, { InlineKeyboardMarkup, Message } from 'node-telegram-bot-api';
import { Chats } from '../stores';

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