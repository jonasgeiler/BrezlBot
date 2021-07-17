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
	bot.onText(commandRegex("schleichdi"), async (msg) => {
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

		settings.autoHide = !settings.autoHide;

		setSettings(msg.chat.id, settings);

		const newState = settings.autoHide ? "eingeschoidet" : "ausgeschoidet";
		const comment = settings.autoHide
			? "Meine Nochrichdn bleim ned lang!"
			: "Sog hoid wenn i meine Nochrichdn wegdoa soi...";

		await sendMessage(
			bot,
			msg,
			`<b>Da Schleich-di-Modus wurde ${newState}.</b>`,
			comment,
		);
	});
};
