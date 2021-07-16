import TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('new_chat_members', async msg => {
		if (!isGroupMessage(msg)) return;

		const me = await bot.getMe();

		for (let member of msg.new_chat_members!) {
			if (member.id === me.id) {
				// I got invited to a chat!
				if (isFromUser(msg)) storeUser(msg.chat.id, msg.from!);

				await sendMessage(
					bot, msg,
					`<b>Wos gäd ob, Chod!</b>
<b>Measse, dass ihr mi hizugfügt hobt!</b>

Vo 'etz an zähle i <i>olle</i> Brezln fia <i>olle</i> Mitgliada in dem Chod.
Ihr kennts Brezln teiln, indem ihr auf de Nochrichdn andera Benutza mid am Brezl-Emoji (&#x1F968;) ontwortets oda indem ihr den Benutza (@benutzernama) in oana Nochricht mid am Brezl eawähnt.
Ihr kennts mehr üba meine Funktiona eafahrn, indem ihr mi privod kontaktiad.

<b>Jeda Benutza eahält</b> <code>${config.defaultBrezls}</code> <b>Brezln.</b>

<code>P.S. Funktioniad nua wenn ihr ma Zuagriff auf de Nochrichdn gegem hobt. &#x2764;</code>`,
					'',
					{
						remove: false, // Don't remove, as this is an introduction
						reply:  false, // Can't reply
					},
				);

				break;
			}
		}
	});
};