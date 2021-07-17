import type TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { getBrezls, getMembers, isFromUser, sendMessage, setBrezls } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('successful_payment', async msg => {
		console.log(msg);
		if (!isFromUser(msg) || !msg.successful_payment || !msg.successful_payment.invoice_payload.startsWith('brezlbot_buy_brezl')) return;

		const parts = msg.successful_payment.invoice_payload.split(':');

		if (parts.length < 2) {
			await sendMessage(
				bot, msg,
				`<b>Da zuaghearige Chod da Zahlung konnte leida ned eamiddlt wern! &#x1F62C;</b>
Bitte kontaktiere @Skayo!`,
				'',
				{
					removeButtonText: 'Scheise',
					private:          true,
					notification:     true, // Enable notification
					remove:           false,
				},
			);

			return;
		}

		const chatId = parseInt(parts[1]);

		// Get users name
		const members = getMembers(chatId);
		const name = members[msg.from!.id].name;

		// Update brezls
		const brezls = getBrezls(chatId, msg.from!.id);
		setBrezls(chatId, msg.from!.id, brezls + config.brezlPrice);

		await sendMessage(
			bot, msg,
			`<b>Zahlung eafolgreich! &#x1F4B8;</b>
De <code>${config.brezlPrice}</code> Brezln wurdn zua deim Konto hinzugfügt! &#x1F633;`,
			`'etz kannst du bei deine Freindn ogem, du Freak! &#x1F609;`,
			{
				removeButtonText: 'Supa cool!',
				private:          true,
				notification:     true,
				remove:           false,
			},
		);

		await sendMessage(
			bot, msg,
			`<b>${name} hod eafolgreich gzoit! &#x1F4B8;</b>
De <code>${config.brezlPrice}</code> Brezln wurdn zua seim Konto hinzugfügt! &#x1F633;`,
			`I konn ned glam dass dea ma grade echts Gejd gegem hod &#x1F602;&#x1F602;&#x1F602;
Vuin, vuin Dank! Wiaklich!`,
			{
				removeButtonText: 'Supa cool!',
				reply:            false,
				chatId, // Overwrite Chat ID so the message will appear in the group chat
			},
		);
	});
}

/*
{
  message_id: 553,
  from: {
    id: 337167146,
    is_bot: false,
    first_name: 'Skayo',
    username: 'Skayo',
    language_code: 'de'
  },
  chat: {
    id: 337167146,
    first_name: 'Skayo',
    username: 'Skayo',
    type: 'private'
  },
  date: 1626481347,
  successful_payment: {
    currency: 'EUR',
    total_amount: 100,
    invoice_payload: 'brezlbot_buy_brezlpackung',
    telegram_payment_charge_id: '_',
    provider_payment_charge_id: 'ch_1JE1ITD76TDe2rhqJPMi27w4'
  }
}
 */