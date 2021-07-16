import type TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('gusch'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		const member = await bot.getChatMember(msg.chat.id, msg.from!.id.toString());

		if (member.status !== 'administrator' && member.status !== 'creator') {
			await sendMessage(
				bot, msg,
				`<b>Tut ma leid, aba nua Administratorn könna desn Befehl vawendn :(</b>`,
				`Dia vatraut oafach niemand &#x1F937;`,
				{ removeButtonText: 'Schade' }
			);

			return;
		}

		let sendLess: boolean = Chats.get(msg.chat.id.toString(), 'settings.sendLess'); // Load setting

		sendLess = !sendLess; // Toggle setting

		Chats.set(msg.chat.id.toString(), sendLess, 'settings.sendLess'); // Save setting

		const newState = sendLess ? 'eingeschoidet' : 'ausgeschoidet';
		const comment = sendLess ? 'I werd mi bissal zuarugghoidn...' : 'Machts eich auf blede Kommentare gfossd!';
		const removeButtonText = sendLess ? 'I hob Gusch gsogt!' : 'Bassd';

		await sendMessage(
			bot, msg,
			`<b>Da Gusch-Modus wurde ${newState}.</b>`,
			comment,
			{ removeButtonText }
		);
	});
}