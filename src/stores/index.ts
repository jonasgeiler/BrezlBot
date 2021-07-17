import { Enmap } from "enmap";
import { ChatMembers } from "../types";

export type ChatsEnmap = Enmap<
	string | number,
	{
		settings: {
			sendLess: boolean;
			autoHide: boolean;
			autoHideDelay: 15;
		};
		members: ChatMembers;
	}
>;

export const Chats = new Enmap("chats", {
	fetchAll: false,
	autoFetch: true,
	autoEnsure: {
		settings: {
			sendLess: false,
			autoHide: false,
			autoHideDelay: 15,
		},
		members: {},
	},
});
