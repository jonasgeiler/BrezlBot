import type TelegramBot from 'node-telegram-bot-api';
import { commandRegex, isPrivateMessage, sendMessage } from '../../utils';

export default (bot: TelegramBot) => {
	bot.onText(commandRegex('start'), async msg => {
		if (!isPrivateMessage(msg)) return;

		await sendMessage(
			bot, msg,
			`<b>Servus, mei Nama is BrezlBot, und mei oanziga Zweck is's, Ihna dabei zua heifd, Dankbarkeit zua vabroaden, zua zelebriern und a weng Gaudi zua hom.</b>

Nimm mi oafach in dei Gruppn auf, und ihr werdet im Nui komma nix Brezln vagem! Du kannst aa /hilfe benutzn, um üba meine Fähigkeitn zua lesn :^)`,
			'',
			{
				private: true, // Respond to message in private chat
				remove: false, // Don't remove message
				reply:   false, // No message to reply to
			},
		);
	});
}