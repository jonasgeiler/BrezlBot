import { User } from "node-telegram-bot-api";
import config from "../config";
import { Chats, ChatsEnmap } from "../stores";
import { Chat, ChatMembers, ChatSettings } from "../types";

export function storeUser(chatId: number, user: User): void {
	if (user.is_bot) {
		return;
	}

	const members: ChatMembers = Chats.get(chatId.toString(), "members");

	let name: string;

	if (user.username) {
		name = "@" + user.username;
	} else {
		if (user.last_name) {
			name = user.first_name + " " + user.last_name;
		} else {
			name = user.first_name;
		}
	}

	if (!members[user.id]) {
		// Add member
		members[user.id] = {
			id: user.id,
			brezls: config.defaultBrezls,
			lastRobbery: 0,
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
	Chats.set(chatId.toString(), members, "members");
}

export const getChat = (chatId: number): Chat => Chats.get(chatId.toString());
export const deleteChat = (chatId: number): ChatsEnmap =>
	Chats.delete(chatId.toString());
export const chatExists = (chatId: number): boolean =>
	Chats.has(chatId.toString());

export const getMembers = (chatId: number): ChatMembers =>
	Chats.get(chatId.toString(), "members");
export const setMembers = (chatId: number, members: ChatMembers): ChatsEnmap =>
	Chats.set(chatId.toString(), members, "members");

export const getSettings = (chatId: number): ChatSettings =>
	Chats.get(chatId.toString(), "settings");
export const setSettings = (
	chatId: number,
	settings: ChatSettings,
): ChatsEnmap => Chats.set(chatId.toString(), settings, "settings");

export const getBrezls = (chatId: number, userId: number): number =>
	getMembers(chatId)[userId]?.brezls;

export function setBrezls(
	chatId: number,
	userId: number,
	brezls: number,
): void {
	if (brezls > 0 && brezls < Number.MAX_SAFE_INTEGER) {
		const members = getMembers(chatId);

		members[userId].brezls = brezls;

		setMembers(chatId, members);
	}
}

export const getLastRobbery = (chatId: number, userId: number): number =>
	getMembers(chatId)[userId]?.lastRobbery;

export function setLastRobbery(
	chatId: number,
	userId: number,
	lastRobbery: number,
): void {
	const members = getMembers(chatId);

	members[userId].lastRobbery = lastRobbery;

	setMembers(chatId, members);
}
