import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, getSettings, isForwarded, isFromUser, isGroupMessage, sendMessage, setSettings } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('schleichdi_wartezeid', ['number']), async (msg, match) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		const member = await bot.getChatMember(msg.chat.id, msg.from!.id.toString());

		if (member.status !== 'administrator' && member.status !== 'creator') {
			await sendMessage(
				bot, msg,
				`<b>Tut ma leid, aba nua Administratorn könna desn Befehl vawendn :(</b>`,
				`Dia vatraut oafach niemand &#x1F937;`,
				{ removeButtonText: 'Schade' },
			);

			return;
		}

		let delay = parseInt(match![1]);

		if (delay < 1 || delay > 1440) {
			await sendMessage(
				bot, msg,
				`<b>I konn nua Werte zwischn 1 und 1440 Minudn ois Wartezeid fia den Schleich-di-Modus akzeptiern.</b>
Bitte korrigiere dei Ofroge und vasuche 's eaneit.`,
				`So lang konn i oafach ned wardn! &#x1F634;`,
				{ removeButtonText: 'I probias nochmoi' },
			);

			return;
		}

		let settings = getSettings(msg.chat.id);

		settings.autoHideDelay = delay;

		setSettings(msg.chat.id, settings);

		await sendMessage(
			bot, msg,
			`<b>De Wartezeid fia den Schleich-di-Modus wurde auf ${delay} Minudn eingestäit.</b>`,
			`I hoid ma Stoppuah bereit!`,
		);
	});
}