import type TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('schleichdi_wartezeid', ['number']), async (msg, match) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		const member = await bot.getChatMember(msg.chat.id, msg.from!.id.toString());

		if (member.status !== 'administrator' && member.status !== 'creator') {
			await sendMessage(
				bot, msg,
				`<b>Tut ma leid, aba nua Admins könna desn Befehl vawendn :(</b>`,
				`Dia vatraut oafach niemand &#x1F937;`,
			);

			return;
		}

		let delay = parseInt(match![1]);

		if (delay < 1 || delay > 1440) {
			await sendMessage(
				bot, msg,
				`<b>I konn nua Werte zwischn 1 und 1440 Minudn ois Wartezeid fia den Schleich-di-Modus akzeptiern.</b>
Bitte koarigiern Sie Ihre Ofroge und vasuchn Sie 's eaneit.`,
				`So lang konn i oafach ned wardn! &#x1F634;`,
			);

			return;
		}

		Chats.set(msg.chat.id.toString(), delay, 'settings.autoHideDelay'); // Save setting

		await sendMessage(
			bot, msg,
			`<b>De Wartezeid fia den Schleich-di-Modus wurde auf ${delay} Minudn eingestäit.</b>`,
			`I hoid ma Stoppuah bereit!`,
		);
	});
}