import TelegramBot from 'node-telegram-bot-api';
import config from '../../config';
import { Chats } from '../../stores';
import { ChatMember } from '../../types';
import { isForwarded, isFromUser, isGroupMessage, isNumeric, removeAtSign, sendMessage, storeUser } from '../../utils';

export default (bot: TelegramBot) => {
	const bretzlRegex = /(\u{1F968})/gu;

	bot.onText(bretzlRegex, async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg) || !msg.text) return;

		const matches = msg.text.replace(
			// Replace shorthand
			/(\u{1F968}) *[Xx×*] *(\d+)/gu,
			(fullMatch: string, brezlEmoji: string, multiplier: string) => {
				if (!isNumeric(multiplier)) return fullMatch;

				return brezlEmoji.repeat(parseInt(multiplier));
			},
		).match(bretzlRegex);

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
					`Warum teiln Sie des ned in zwoa separate Brezl-Dransaktiona auf? &#x1F914;`,
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
						`<b>Nehma Sie mi übahabt eanst?! De Person is koa Mitgliad dess Chats oda hod no nix gschriebn.</b>`,
						`Wenn 's si übahabt um a reale Person handelt... &#x1F914;`,
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
				);
			} else {
				await sendMessage(
					bot, msg,
					`<b>Tut ma leid, aba Computa könna koa Brezln empfangn :(</b>`,
					`I glab ned oamoi, dass sie Menschennahrung essn könna &#x1F914;&#x1F914;&#x1F914;`,
				);
			}

			return;
		}

		if (senderId === receiverId) {
			await sendMessage(
				bot, msg,
				`<b>Warum woin Sie de köstlichn Brezln an si seibsd schickn...???</b>`,
				`Sie san a wirklich komischa Mensch &#x1F610;`,
			);

			return;
		}

		const sender = await bot.getChatMember(msg.chat.id, senderId.toString());

		storeUser(msg.chat.id, sender.user);
		storeUser(msg.chat.id, receiver.user);

		const senderData: ChatMember = chat.members[senderId];
		const receiverData: ChatMember = chat.members[receiverId];

		if (transferAmount > senderData.brezls) {
			await sendMessage(
				bot, msg,
				`<b>Na Hoppala... Sie hom ned genug Brezln!</b>`,
				`Sie kanntn vuileicht a Crowdfunding-Seitn stardn, um a boh Brezln vo Ihrn Freindn und andern Teilnehmern zua griagn. &#x1F643;`,
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
			comment = 'Warum hom Sie ned mehr Brezln vagem? &#x1F634;';
		} else if (transferAmount > 60) {
			comment = 'Schuidn Sie eahm vui Gejd oda wos? &#x1F639;';
		}

		await sendMessage(
			bot, msg,
			`${senderData.name} <b>gob</b> <code>${transferAmount}</code> <b>${transferAmount === 1 ? 'Brezl' : 'Brezln'} an</b> ${receiverData.name}!`,
			comment,
		);
	});
}