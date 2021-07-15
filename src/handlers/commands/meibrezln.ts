import type TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { ChatMember } from '../../types';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('meibrezln'), async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		const chat = Chats.get(msg.chat.id.toString());
		const members: ChatMember[] = Object.values(chat.members);

		let brezler: ChatMember | undefined;
		for (let member of members) {
			if (msg.from!.id === member.id) {
				brezler = member;
				break;
			}
		}

		if (!brezler) return; // Just ignore idk

		let comment = 'I schätze, Sie vaschenkn ned vui vo Ihrn Brezln... und Ihre Freinde aa ned. &#x1F62A;';
		if (brezler.brezls < 25) {
			comment = 'Wo san oi dei Brezln hi?! &#x1F631;&#x1F631;&#x1F631;';
		} else if (brezler.brezls > 60) {
			comment = 'Na servas, i bin beeindruckt! Wia hom Sie so vui Brezln vadeant?! Handeln Sie mid Krypto oda wos?! &#x1F640;';
		}

		await sendMessage(
			bot, msg,
			`${brezler.name} <b>hod</b> <code>${brezler.brezls}</code> <b>Brezln auf seim Konto.</b>`,
			comment,
		);
	});
}