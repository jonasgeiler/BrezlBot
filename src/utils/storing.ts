import { User } from 'node-telegram-bot-api';
import config from '../config';
import { Chats } from '../stores';

export function storeUser(chatId: number, user: User) {
	if (user.is_bot) return;

	const members = Chats.get(chatId.toString(), 'members');

	let name: string;

	if (user.username) {
		name = '@' + user.username;
	} else {
		if (user.last_name) {
			name = user.first_name + ' ' + user.last_name;
		} else {
			name = user.first_name;
		}
	}

	if (!members[user.id]) {
		// Add member
		members[user.id] = {
			id:     user.id,
			brezls: config.defaultBrezls,
			name,
		};
	} else if (members[user.id].name !== name) {
		// Update name
		members[user.id].name = name;
	} else {
		// Don't do anything
		return;
	}

	// Update members
	Chats.set(chatId.toString(), members, 'members');
}