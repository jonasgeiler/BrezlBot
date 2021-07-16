import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, isForwarded, isFromUser, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('hilfe'), async msg => {
		if (!isFromUser(msg) || isForwarded(msg)) return;

		await sendMessage(
			bot, msg,
			`<b>Foigends konn i doa:</b>

/topbrezler - Zeigt de Top-5 Brezler im aktuelln Chod an

/meibrezln - Zeigt deinen Brezl-Kontostand an

/schbuin - Starte a Glücksschbui, bei am ma Brezl gwinna oda valiarn konn

/gusch - Schoidet den Gusch-Modus ein oda aus. Wenn ea eingschoidet is, san manche moana Nochrichdn kürza. (nua fia Administratorn vafügbar)

/schleichdi - Schoidet den Schleich-di-Modus ein oda aus. Wenn ea eingschoidet is, vaschwindn manche moana Nochrichdn noch oana bestimmdn Zeid. (nua fia Administratorn vafügbar)

/schleichdi_wartezeid <code>&lt;minudn&gt;</code> - Stäit a noch wia vuin Minudn de Nochrichdn vaschwindn, wenn da Schleich-di-Modus eingschoiden is. (nua fia Administratorn vafügbar)

<i>Wenn du mi aus da Gruppn wirfst, wern olle Brezl-Dadn fia den Chod gelöscht. Oan solchn Schoassdreck konn i oafach ned vazeihn!!!</i>`,
			'',
			{
				remove: false, // Don't remove message
				private: true, // Respond to message in private chat
				reply: msg.chat.type === 'private', // Use reply in private chat only
			},
		);
	});
}