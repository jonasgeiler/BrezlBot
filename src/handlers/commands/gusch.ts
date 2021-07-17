import type TelegramBot from "node-telegram-bot-api";
import {
	commandRegex,
	getSettings,
	isForwarded,
	isFromUser,
	isGroupMessage,
	sendMessage,
	setSettings,
} from "../../utils";

export default (bot: TelegramBot): void => {
	bot.onText(commandRegex("gusch"), async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) {
			return;
		}

		const member = await bot.getChatMember(
			msg.chat.id,
			msg.from.id.toString(),
		);

		if (member.status !== "administrator" && member.status !== "creator") {
			await sendMessage(
				bot,
				msg,
				`<b>Tut ma leid, aba nua Administratorn könna desn Befehl vawendn :(</b>`,
				`Dia vatraut oafach niemand &#x1F937;`,
				{ removeButtonText: "Schade" },
			);

			return;
		}

		const settings = getSettings(msg.chat.id);

		settings.sendLess = !settings.sendLess;

		setSettings(msg.chat.id, settings);

		const newState = settings.sendLess ? "eingeschoidet" : "ausgeschoidet";
		const comment = settings.sendLess
			? "I werd mi bissal zuarugghoidn..."
			: "Machts eich auf blede Kommentare gfossd!";
		const removeButtonText = settings.sendLess
			? "I hob Gusch gsogt!"
			: "Bassd";

		await sendMessage(
			bot,
			msg,
			`<b>Da Gusch-Modus wurde ${newState}.</b>`,
			comment,
			{ removeButtonText },
		);
	});
};
