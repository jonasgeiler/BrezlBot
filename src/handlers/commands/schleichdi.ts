import type TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('schleichdi'), async (msg) => {
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

		let autoHide: boolean = Chats.get(msg.chat.id.toString(), 'settings.autoHide'); // Load setting

		autoHide = !autoHide; // Toggle setting

		Chats.set(msg.chat.id.toString(), autoHide, 'settings.autoHide'); // Save setting

		const newState = autoHide ? 'eingeschoidet' : 'ausgeschoidet';
		const comment = autoHide ? 'Meine Nochrichdn bleim ned lang!' : 'Sog hoid wenn i meine Nochrichdn wegdoa soi...';

		await sendMessage(
			bot, msg,
			`<b>Da Schleich-di-Modus wurde ${newState}.</b>`,
			comment,
		);
	});
}