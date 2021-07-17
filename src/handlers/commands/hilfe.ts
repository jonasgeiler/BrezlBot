import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('hilfe'), async msg => {
		if (!isFromUser(msg) || isForwarded(msg)) return;

		if (isGroupMessage(msg)) {
			await sendMessage(
				bot, msg,
				`<b>Des gäd nua im privadn Chat!</b>
Klicke <a href="https://t.me/brezlbot">hia</a> um oan zua stardn.`,
				`Waarad oafach zua vui fia Gruppnchats... &#x1F937;`,
				{ removeButtonText: 'Okay' },
			);

			return;
		}

		await sendMessage(
			bot, msg,
			`<b>Foigends konn i doa:</b>
(nua in Gruppn)

/topbrezler - &#x1F3C5; Zeigt de Top-5 Brezler im aktuelln Chat an

/meibrezln - &#x1F968; Zeigt deinen Brezl-Kontostand an

/schbuin - &#x1F3B2; Starte a Glücksschbui, bei dem ma Brezl gwinna oda valiarn konn

/brezlfladern - &#x1F3C3; Vasuche vo am Brezlstand a boah Brezl zua fladern (gäd nua 1-moi pro Dog)

/brezlkaffn - &#x1F4B5; Kaufe a riesn Packung mid köstlichn Brezln (echts Gejd)

/gusch - &#x1F910; Schoidet den Gusch-Modus ein oda aus. Wenn ea eingschoidet is, san manche moana Nochrichdn kürza. (nua fia Administratorn vafügbar)

/schleichdi - &#x1F595; Schoidet den Schleich-di-Modus ein oda aus. Wenn ea eingschoidet is, vaschwindn manche moana Nochrichdn noch oana bestimmdn Zeid. (nua fia Administratorn vafügbar)

/schleichdi_wartezeid <code>&lt;minudn&gt;</code> - &#x23F1; Stäit a noch wia vuin Minudn de Nochrichdn vaschwindn, wenn da Schleich-di-Modus eingschoiden is. (nua fia Administratorn vafügbar)

/hilfe - &#x1F691; Zeigt den Hilfe-Text an, mid oin Kommandos de i beherrsche

<i>Wenn du mi aus da Gruppn wirfst, wern olle Brezl-Dadn fia den Chat gelöscht. Oan solchn Schoassdreck konn i oafach ned vazeihn!!!</i>`,
			'',
			{
				remove:       false, // Don't remove message
				private:      true, // Respond to message in private chat
			},
		);
	});
}