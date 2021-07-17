import type TelegramBot from "node-telegram-bot-api";
import {
	commandRegex,
	getMembers,
	isForwarded,
	isFromUser,
	isGroupMessage,
	sendMessage,
	storeUser,
} from "../../utils";

export default (bot: TelegramBot): void => {
	bot.onText(commandRegex("topbrezler"), async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) {
			return;
		}

		storeUser(msg.chat.id, msg.from);

		const members = getMembers(msg.chat.id);
		const topBrezler = Object.values(members);

		if (topBrezler.length === 0) {
			await sendMessage(
				bot,
				msg,
				`<b>Oida, in dea Gruppn gibt 's koa Brezl-Liabhobr! &#x1F47A;&#x1F47A;&#x1F47A;</b>

<code>Machts schnei und ontwortet auf de Nochricht vo jemandem mid &#x1F968;!!!!</code>`,
				"",
				{ removeAllowedId: false },
			);

			return;
		}

		topBrezler.sort((a, b) => b.brezls - a.brezls).splice(10);

		let message = `<b>Do san de Top-${topBrezler.length}-Brezl-Besitza dess Chats:</b>\n`;

		let place = 1;
		for (const brezler of topBrezler) {
			message += `\n${place}. `;

			if (brezler.name.startsWith("@")) {
				message += brezler.name;
			} else {
				message += `<a href="tg://user?id=${brezler.id}">${brezler.name}</a>`;
			}

			message += ` mid ${brezler.brezls} Brezln!`;
			place++;
		}

		await sendMessage(bot, msg, message, `Ned aufgem! &#x1F4AA;`, {
			removeAllowedId: false,
		});
	});
};
