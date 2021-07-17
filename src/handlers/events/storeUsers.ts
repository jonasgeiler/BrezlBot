import type TelegramBot from "node-telegram-bot-api";
import { isFromUser, isGroupMessage, storeUser } from "../../utils";

export default (bot: TelegramBot): void => {
	bot.on("message", async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg)) {
			return;
		}

		storeUser(msg.chat.id, msg.from);
	});
};
