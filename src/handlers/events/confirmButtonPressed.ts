import type TelegramBot from 'node-telegram-bot-api';
import { isNumeric } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('callback_query', async (callbackQuery) => {
		if (!callbackQuery.data || !callbackQuery.data.startsWith('brezlbot_confirm_msg') || !callbackQuery.message) return;

		const msg = callbackQuery.message;

		const parts = callbackQuery.data.split(':');
		if (parts.length > 1 && isNumeric(parts[1]) && callbackQuery.from.id !== parseInt(parts[1])) {
			await bot.answerCallbackQuery(callbackQuery.id, {
				text: 'Du kannst de Nochricht ned bestätign'
			});

			return;
		}

		await bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Nochricht bestätigt'
		});
		await bot.deleteMessage(msg.chat.id, msg.message_id.toString());
	});
}