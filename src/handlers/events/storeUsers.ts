import type TelegramBot from 'node-telegram-bot-api';
import { isFromUser, isGroupMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('message', async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg)) return;

		const sender = msg.from!;

		storeUser(msg.chat.id, sender);
	});
}