import type TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { commandRegex, getBrezls, isForwarded, isFromUser, isGroupMessage, sendMessage, storeUser } from '../../utils';

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

		const brezls = getBrezls(msg.chat.id, msg.from!.id);

		if (brezls + config.brezlPrice > Number.MAX_SAFE_INTEGER) {
			await sendMessage(
				bot, msg,
				`<b>Bisd du deppod! Du hosd scho vui zua vui Brezln und kannst ned mehr empfangn!</b>`,
				`I glab aa ned dass du no mehr Brezln brauchst! &#x1F605;`,
				{ removeButtonText: 'Wow!' },
			);

			return;
		}

		try {
			await bot.sendInvoice(
				msg.from!.id,
				'A Packung Brezl',
				`A riesn Packung mid ${config.brezlPrice} köstlichn Brezln fia den "${msg.chat.title}" Chat. Garantierta Freindschoftspreis! Kaffn Sie schnei! Nua so lang da Vorrod reicht!`,
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
		} catch (e) {
			await sendMessage(
				bot, msg,
				`<b>I konnte dia leida koa Rechnung senden! &#x1F62D;&#x1F62D;&#x1F62D;</b>
Möglicherweise musst du east oan privadn Chat mid mia <a href="https://t.me/brezlbot">stardn</a>.`,
				`I varate aa niemandn wos du mia so privod schreibst &#x1F60F;`
			);

			return;
		}

		await sendMessage(
			bot, msg,
			`<b>Die Rechnung wurde dir privat zugesendet! &#x1F60E;</b>
Bitte überprüfe deine Nachrichten.`,
			`Wuist du wirklich welche kaffn?!?! &#x1F633;`
		);
	});
}