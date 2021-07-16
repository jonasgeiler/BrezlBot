import TelegramBot from 'node-telegram-bot-api';
import { Chats } from '../../stores';
import { isFromUser, isGroupMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.on('left_chat_member', async msg => {
		if (!isGroupMessage(msg)) return;

		const me = await bot.getMe();

		if (msg.left_chat_member?.id === me.id && Chats.has(msg.chat.id.toString())) {
			// I GOT KICKED AAHHHHH
			Chats.delete(msg.chat.id.toString()); // Delete data

			if (isFromUser(msg)) {
				await sendMessage(
					bot, msg,
					`<b>I wurde aus "${msg.chat.title}" aussegewoafa, oiso wurdn de Dadn üba de Brezln da Benutza gelöscht!</b>

Vuin Dank fia de Einladung in Ihrn Chod - Du kannst mi gern schbada wieda hizufügn.`,
					`I hoff i hob nix foisches gmacht! &#x1F97A;`,
					{
						private: true, // Respond to message in private chat
						remove:  false, // Don't remove message
						reply:   false, // Can't reply
					},
				);
			}
		}
	});
}