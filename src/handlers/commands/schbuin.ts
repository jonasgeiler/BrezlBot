import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, getBrezls, isForwarded, isFromUser, isGroupMessage, sendMessage, setBrezls, storeUser, wait } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('schbuin'), async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) return;

		storeUser(msg.chat.id, msg.from!);

		const sentMsg = await sendMessage(
			bot, msg,
			`Ontwortet auf de Nochricht mid am Würfl-Emoji &#x1F3B2; um zua würfeln!

<b>Kost</b> <code>3</code> <b>Brezl!</b>
Ma konn bis zua <code>2</code> Brezl <b>valiarn</b> und bis zua <code>3</code> <b>gwinna</b>!
<b>Jeder</b> kann mitmachen!`,
			`I drugg eich de Dauma &#x270A;`,
			{ removeButtonText: 'Beendn' },
		);

		bot.onReplyToMessage(msg.chat.id, sentMsg.message_id, async msg => {
			if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg) || !msg.dice) return;

			let brezls = getBrezls(msg.chat.id, msg.from!.id);

			if (brezls < 3) {
				await sendMessage(
					bot, msg,
					`<b>Na Hoppala... Du hosd ned genug Brezln!</b>`,
					`Hosd du vuileicht scho zua vui gschbuit? &#x1F914;`,
					{ removeButtonText: 'Ze fix' },
				);

				return;
			}

			const wonAmount = msg.dice.value - 3;

			let wonText = 'leida nix gwonna.';
			let comment = 'Drotzdem no bessa ois welche zua valiarn! &#x1F643;';
			let removeButtonText = 'Eh okay';
			if (wonAmount > 0) {
				wonText = `<code>${wonAmount}</code> Brezl gwonna!`;
				comment = `I gfrei mi so fia di!!! &#x1F631;&#x1F631;`;
				removeButtonText = 'Geil!';
			} else if (wonAmount < 0) {
				wonText = `<code>${Math.abs(wonAmount)}</code> Brezl valorn...`;
				comment = `Ze fix no moi, so a Scheise! &#x1F92C;`;
				removeButtonText = 'Oasch...';
			}

			// Wait 5 seconds until animation stopped
			await wait(5000);

			brezls = getBrezls(msg.chat.id, msg.from!.id)
			const newBrezls = brezls + wonAmount;

			if (brezls < 3 || newBrezls < 0) {
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

			await sendMessage(
				bot, msg,
				`<b>Du hast ${wonText}</b>`,
				comment,
				{ removeButtonText },
			);
		});
	});
}