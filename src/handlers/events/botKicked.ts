import TelegramBot from "node-telegram-bot-api";
import {
	chatExists,
	deleteChat,
	getBotId,
	isFromUser,
	isGroupMessage,
	sendMessage,
} from "../../utils";

export default (bot: TelegramBot): void => {
	bot.on("left_chat_member", async (msg) => {
		if (!isGroupMessage(msg)) {
			return;
		}

		const botId = await getBotId(bot);

		if (msg.left_chat_member?.id === botId && chatExists(msg.chat.id)) {
			// I GOT KICKED AAHHHHH

			deleteChat(msg.chat.id);

			if (isFromUser(msg)) {
				await sendMessage(
					bot,
					msg,
					`<b>I wurde aus "${msg.chat.title}" aussegewoafa, oiso wurdn de Dadn üba de Brezln da Benutza gelöscht!</b>

Vuin Dank fia de Einladung in deim Chat - Du kannst mi gern schbada wieda hizufügn.`,
					`I hoff i hob nix foisches gmacht! &#x1F97A;`,
					{
						private: true, // Respond to message in private chat
						remove: false, // Don't remove message
						reply: false, // Can't reply
					},
				);
			}
		}
	});
};
