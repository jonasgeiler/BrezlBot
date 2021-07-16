import type TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { ChatMember, ChatMembers } from '../../types';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('topbrezler'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		const members: ChatMembers = Chats.get(msg.chat.id.toString(), 'members');

		let topBrezler: ChatMember[] = Object.values(members);

		if (topBrezler.length === 0) {
			await sendMessage(
				bot, msg,
				`<b>Oida, in dea Gruppn gibt 's koa Brezl-Liabhobr! &#x1F47A;&#x1F47A;&#x1F47A;</b>

<code>Machts schnei und ontwortet auf de Nochricht vo jemandem mid &#x1F968;!!!!</code>`,
				'',
				{ removeAllowedId: false }
			);

			return;
		}

		topBrezler.sort((a: any, b: any) => b.brezls - a.brezls)
		          .splice(10);

		let message = `<b>Do san de Top-${topBrezler.length}-Brezl-Besitza dess Chats:</b>\n`;

		let place = 1;
		for (let brezler of topBrezler) {
			message += `\n${place}. `;

			if (brezler.name.startsWith('@')) {
				message += brezler.name;
			} else {
				message += `<a href="tg://user?id=${brezler.id}">${brezler.name}</a>`;
			}

			message += ` mid ${brezler.brezls} Brezln!`;
			place++;
		}

		await sendMessage(
			bot, msg,
			message,
			`Ned aufgem! &#x1F4AA;`,
			{ removeAllowedId: false }
		);
	});
}