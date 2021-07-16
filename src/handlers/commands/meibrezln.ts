import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, getBrezls, isForwarded, isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('meibrezln'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		const brezls = getBrezls(msg.chat.id, msg.from!.id);

		let comment = 'I schätze, du vaschenkst ned vui vo deine Brezln... und dei Freinde aa ned. &#x1F62A;';
		let removeButtonText = 'Okay';
		if (brezls < 25) {
			comment = 'Wo san oi dei Brezln hi?! &#x1F631;&#x1F631;&#x1F631;';
			removeButtonText = 'Oida!?';
		} else if (brezls > 60) {
			comment = 'Na servas, i bin beeindruckt! Wia hosd du so vui Brezln vadeant?! Handelst du mid Krypto oda wos?! &#x1F640;';
			removeButtonText = 'Schbidznnmäßig!'
		}

		await sendMessage(
			bot, msg,
			`<b>Du hosd</b> <code>${brezls}</code> <b>Brezln auf deim Konto.</b>`,
			comment,
			{ removeButtonText }
		);
	});
}