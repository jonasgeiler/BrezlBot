import TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { Chats } from '../../stores';
import { isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('new_chat_members', async (msg) => {
		if (!isGroupMessage(msg)) return;

		const me = await bot.getMe();

		for (let member of msg.new_chat_members!) {
			if (member.id === me.id && !Chats.has(msg.chat.id.toString())) {
				// I got invited to a chat!
				Chats.set(msg.chat.id.toString(), {
					settings: {
						sendLess:      false,
						autoHide:      false,
						autoHideDelay: 15,
					},
					members:  {},
				});

				await sendMessage(
					bot, msg,
					`<b>Wos gäd ob, Chod!</b>
<b>Measse, dass Sie mi hizugefügt hom!</b>

Vo 'etz an zähle i <i>olle</i> Brezln fia <i>olle</i> Mitgliada in dem Chod. Sie könna Brezln teiln, indem Sie auf de Nochrichdn andera Benutza mid am Brezl-Emoji (&#x1F968;) antwoadn oda indem Sie den Benutza (@benutzernama) in oana Nochricht mid am Brezl eawähna.
Sie könna mehr üba meine Funktiona eafahrn, indem Sie mi privod kontaktiern.

<b>Jeda Benutza eahält</b> <code>${config.defaultBrezls}</code> <b>Brezln.</b>

<code>P.S. Funktioniad nua wenn Sie ma Zuagriff auf de Nochrichdn gegem hom. &#x2764;</code>`,
				);

				break;
			}
		}
	});
};