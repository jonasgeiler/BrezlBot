import { User } from 'node-telegram-bot-api';
import config from '../config';
import { Chats } from '../stores';
import { ChatMembers } from '../types';

export function storeUser(chatId: number, user: User) {
	if (user.is_bot) return;

	const members: ChatMembers = Chats.get(chatId.toString(), 'members');

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

export function getBrezls(chatId: number, userId: number): number {
	let members: ChatMembers = Chats.get(chatId.toString(), 'members'); // Load members

	return members[userId].brezls;
}

export function setBrezls(chatId: number, userId: number, newBrezls: number) {
	let members: ChatMembers = Chats.get(chatId.toString(), 'members'); // Load members

	if (newBrezls > 0 && newBrezls < Number.MAX_SAFE_INTEGER) {
		members[userId].brezls = newBrezls; // Update brezls
	}

	Chats.set(chatId.toString(), members, 'members'); // Save members
}