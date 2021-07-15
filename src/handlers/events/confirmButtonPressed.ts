import type TelegramBot from 'node-telegram-bot-api';

export default (bot: TelegramBot) => {
	bot.on('callback_query', async (callbackQuery) => {
		if (callbackQuery.data !== 'brezlbot_delete_msg' || !callbackQuery.message) return;

		const msg = callbackQuery.message;

		if (callbackQuery.from.id !== msg.reply_to_message?.from?.id) {
			await bot.answerCallbackQuery(callbackQuery.id, {
				text: 'Nua da Sender da Ofroge konn de Nochricht bestätign',
				show_alert: true
			});

			return;
		}

		await bot.deleteMessage(msg.chat.id, msg.message_id.toString());

		await bot.answerCallbackQuery(callbackQuery.id, {
			text: 'Nochricht entfernt.'
		});
	});
}