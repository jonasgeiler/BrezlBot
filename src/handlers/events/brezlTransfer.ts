import TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { Chats } from '../../stores';
import { ChatMember } from '../../types';
import { isForwarded, isFromUser, isGroupMessage, isNumeric, removeAtSign, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	const brezlRegex = /(\u{1F968})/gu;

	bot.onText(brezlRegex, async msg => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg) || !msg.text) return;

		const matches = msg.text.replace(
			// Replace shorthand
			/(\u{1F968}) *[Xx×*] *(\d+)/gu,
			(fullMatch: string, brezlEmoji: string, multiplier: string) => {
				if (!isNumeric(multiplier)) return fullMatch;

				return brezlEmoji.repeat(parseInt(multiplier));
			},
		).match(brezlRegex);

		if (!matches || matches.length === 0) return;

		const chat = Chats.get(msg.chat.id.toString());
		const members: ChatMember[] = Object.values(chat.members);

		const transferAmount = matches.length;
		const senderId = msg.from!.id;

		let receiverId: number | undefined;
		if (msg.reply_to_message?.from) {
			receiverId = msg.reply_to_message.from.id;
		} else if (msg.entities) {
			let mentionedUsers = [];

			for (let entity of msg.entities) {
				if (entity.type === 'mention' || entity.type === 'text_mention') {
					mentionedUsers.push(msg.text.substr(entity.offset, entity.length));
				}
			}

			if (mentionedUsers.length === 0) return;

			if (mentionedUsers.length > 1) {
				await sendMessage(
					bot, msg,
					`<b>Tut ma leid, aba 's konn nua oan Brezl-Empfänga gebn.</b>`,
					`Warum teilst du des ned in zwoa separate Brezl-Dransaktiona auf? &#x1F914;`,
					{ removeButtonText: 'Gäd klar' },
				);

				return;
			}

			const mentionedUser = mentionedUsers[0];

			if (config.bot.username.toLowerCase() === removeAtSign(mentionedUser).toLowerCase()) {
				// They mentioned the bot itself, so just grab the bots user ID and let the code below handle it.
				const me = await bot.getMe();

				receiverId = me.id;
			} else {
				for (let member of members) {
					if (member.name.toLowerCase() === mentionedUser.toLowerCase()) {
						receiverId = member.id;
						break;
					}
				}

				if (!receiverId) {
					await sendMessage(
						bot, msg,
						`<b>De Person is koa Mitgliad dess Chats oda hod no nix gschriebn.</b>`,
						`Wenn 's si übahabt um a reale Person handelt... &#x1F914;`,
						{ removeButtonText: 'A Vasuch wars wert' },
					);

					return;
				}
			}
		}

		if (!receiverId) return; // Just ignore

		// We have our sender and receiver
		const receiver = await bot.getChatMember(msg.chat.id, receiverId.toString());

		if (!receiver || receiver.user.is_bot) {
			if (receiver.user.username?.toLowerCase() === config.bot.username.toLowerCase()) {
				await sendMessage(
					bot, msg,
					`<b>Tut ma leid, i konn leida koa Brezln empfangn :(</b>`,
					`Aba i gfrei mi dass du mi so wertschätzt &#x1F60A;&#x1F60A;&#x1F60A;`,
					{ removeButtonText: 'A Vasuch wars wert' },
				);
			} else {
				await sendMessage(
					bot, msg,
					`<b>Tut ma leid, aba Computa könna koa Brezln empfangn :(</b>`,
					`I glab ned oamoi, dass sie Menschennahrung essn könna &#x1F914;&#x1F914;&#x1F914;`,
					{ removeButtonText: 'A Vasuch wars wert' },
				);
			}

			return;
		}

		if (senderId === receiverId) {
			await sendMessage(
				bot, msg,
				`<b>Warum wuist du de köstlichn Brezln an di seibsd vagem...???</b>`,
				`Du bisd a wirklich komischa Mensch &#x1F610;`,
				{ removeButtonText: 'A Vasuch wars wert' },
			);

			return;
		}

		const sender = await bot.getChatMember(msg.chat.id, senderId.toString());

		storeUser(msg.chat.id, sender.user);
		storeUser(msg.chat.id, receiver.user);

		const senderData: ChatMember = chat.members[senderId];
		const receiverData: ChatMember = chat.members[receiverId];

		if (!receiverData) return; // Happens when a message the user replied to is too old

		if (transferAmount > senderData.brezls) {
			await sendMessage(
				bot, msg,
				`<b>Na Hoppala... Du hosd ned genug Brezln!</b>`,
				`Du kanntst vuileicht a Crowdfunding-Seitn stardn, um a boh Brezln vo deine Freindn und andern Teilnehmern zua griagn. &#x1F643;`,
				{ removeButtonText: 'Ze fix' },
			);

			return;
		}

		if (receiverData.brezls + transferAmount > Number.MAX_SAFE_INTEGER) {
			await sendMessage(
				bot, msg,
				`<b>Bisd du deppod! ${receiverData.name} hod scho vui zua vui Brezln und konn ned mehr empfangn!</b>`,
				`I glab aa ned dass de no mehr Brezln brauchn! &#x1F605;`,
				{ removeButtonText: 'Wow!' },
			);

			return;
		}

		// Transfer
		senderData.brezls -= transferAmount;
		receiverData.brezls += transferAmount;

		// Save
		chat.members[senderId] = senderData;
		chat.members[receiverId] = receiverData;

		Chats.set(msg.chat.id.toString(), chat.members, 'members');

		let comment = 'Dea muas a guada Mensch sei! &#x1F63D;';
		if (transferAmount < 25) {
			comment = 'Warum hosd du ned mehr Brezln vagem? &#x1F634;';
		} else if (transferAmount > 60) {
			comment = 'Schuidest du eahm vui Gejd oda wos? &#x1F639;';
		}

		await sendMessage(
			bot, msg,
			`${senderData.name} <b>gob</b> <code>${transferAmount}</code> <b>${transferAmount === 1 ? 'Brezl' : 'Brezln'} an</b> ${receiverData.name}!`,
			comment,
			{
				removeButtonText: 'Dankeschee',
				removeAllowedId: receiverId
			},
		);
	});
}