import TelegramBot from "node-telegram-bot-api";

let botId: number | undefined;

export async function getBotId(bot: TelegramBot): Promise<number> {
	if (!botId) {
		const me = await bot.getMe();

		botId = me.id; // Cache it
	}

	return botId;
}
