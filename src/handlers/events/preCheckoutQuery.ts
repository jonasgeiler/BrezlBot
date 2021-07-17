import type TelegramBot from "node-telegram-bot-api";
import config from "../../config";

export default (bot: TelegramBot): void => {
	bot.on("pre_checkout_query", async (preCheckoutQuery) => {
		if (
			!preCheckoutQuery.invoice_payload.startsWith("brezlbot_buy_brezl")
		) {
			return;
		}

		if (!config.bot.paymentProviderToken) {
			await bot.answerPreCheckoutQuery(preCheckoutQuery.id, false, {
				error_message:
					"Tut ma leid, i konn aktuell leida koa Zahlungen akzeptiern!",
			});

			return;
		}

		await bot.answerPreCheckoutQuery(preCheckoutQuery.id, true);
	});
};

/*
{
  id: '1448121868243413899',
  from: {
    id: 337167146,
    is_bot: false,
    first_name: 'Skayo',
    username: 'Skayo',
    language_code: 'de'
  },
  currency: 'EUR',
  total_amount: 100,
  invoice_payload: 'brezlbot_brezl'
}

 */
