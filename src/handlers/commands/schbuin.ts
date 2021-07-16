import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, getBrezls, isForwarded, isFromUser, isGroupMessage, sendMessage, setBrezls, storeUser, wait } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('schbuin'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		const sentMsg = await sendMessage(
			bot, msg,
			`Ontwortet auf de Nochricht mid am Würfl-Emoji &#x1F3B2; um zua würfeln!

Ma konn bis zua <code>3</code> Brezl <b>valiarn</b> und bis zua <code>3</code> <b>gwinna</b>!
<b>Jeda</b> konn mitmachn!`,
			`I drugg eich de Dauma &#x270A;`,
			{
				removeButtonText: 'Beendn',
				removeAllowedId:  false,
			},
		);

		bot.onReplyToMessage(msg.chat.id, sentMsg.message_id, async msg => {
			if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg) || !msg.dice) return;

			let brezls = getBrezls(msg.chat.id, msg.from!.id);

			if (brezls < 3) {
				await sendMessage(
					bot, msg,
					`<b>Na Hoppala... Du hosd ned genug Brezln!</b>`,
					`Hosd du vuileicht scho zua vui gschbuit? &#x1F914;`,
					{ removeButtonText: 'Ze fix no oamoi' },
				);

				return;
			}

			let result;
			if (msg.dice.value < 4) {
				result = -(4 - msg.dice.value);
			} else {
				result = (msg.dice.value - 3);
			}

			// Wait 5 seconds until animation stopped
			await bot.sendChatAction(msg.chat.id, 'typing');
			await wait(5000);

			brezls = getBrezls(msg.chat.id, msg.from!.id);
			const newBrezls = brezls + result;

			if (newBrezls < 0) {
				await sendMessage(
					bot, msg,
					`<b>Na Hoppala... Du hosd auf oamoi ned genug Brezln mehr!</b>`,
					`Hosd du sie etwa in da Zwischenzeid ausggem? &#x1F914;`,
					{ removeButtonText: 'Ups' },
				);

				return;
			} else if (newBrezls > Number.MAX_SAFE_INTEGER) {
				await sendMessage(
					bot, msg,
					`<b>Bisd du deppod! Du hosd scho vui zua vui Brezln und kannst ned mehr empfangn!</b>`,
					`I glab aa ned dass du no mehr Brezln brauchst! &#x1F605;`,
					{ removeButtonText: 'Wow!' },
				);

				return;
			}

			setBrezls(msg.chat.id, msg.from!.id, newBrezls);

			let text;
			let comment;
			let removeButtonText;
			if (result > 0) {
				text = `<b>Du hast <code>${result}</code> Brezl gwonna!</b>`;
				comment = `I gfrei mi so fia di!!! &#x1F631;&#x1F631;`;
				removeButtonText = 'Geil!';
			} else {
				text = `<b>Du hast <code>${Math.abs(result)}</code> Brezl valorn...</b>`;
				comment = `Ze fix no moi, so a Scheise! &#x1F92C;`;
				removeButtonText = 'Oasch...';
			}

			await sendMessage(
				bot, msg,
				text, comment,
				{ removeButtonText },
			);
		});
	});
}