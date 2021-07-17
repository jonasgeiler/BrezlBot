import type TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { commandRegex, isForwarded, isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('brezlkaffn'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		// Check if payment provider was configured
		if (!config.bot.paymentProviderToken) {
			await sendMessage(
				bot, msg,
				`<b>Tut ma leid, i konn aktuell leida koa Zahlungen akzeptiern!</b>`,
				`I nehme aba gern Brezl an! &#x1F968;`,
				{ removeButtonText: 'Schade' },
			);

			return;
		}

		await bot.sendInvoice(
			msg.from!.id,
			'A Packung Brezl',
			`A riesn Packung mid ${config.brezlPrice} köstlichn Brezln fia den "${msg.chat.title}" Chod. Garantierta Freindschoftspreis! Kaffn Sie schnei! Nua so lang da Vorrod reicht!`,
			`brezlbot_buy_brezl:${msg.chat.id}`,
			config.bot.paymentProviderToken,
			'Analvibrator',
			'EUR',
			[
				{ label: 'A Packung Brezl', amount: config.brezlPrice },
			],
			{
				disable_notification: true,

				max_tip_amount:        1000,
				suggested_tip_amounts: [100, 250, 500, 1000],

				photo_url:    'https://skayo.dev/images/brezlpackung.png',
				photo_height: 1959,
				photo_width:  2670,
			},
		);

		await sendMessage(
			bot, msg,
			`<b>Die Rechnung wurde dir privat zugesendet! &#x1F60E;</b>
Bitte überprüfe deine Nachrichten.`,
			`Wuist du wirklich welche kaffn?!?! &#x1F633;`
		);
	});
}