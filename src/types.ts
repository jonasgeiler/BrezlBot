export interface ChatMember {
	id: number;
	name: string;
	brezls: number;
	lastRobbery: number;
}

export interface ChatMembers {
	[id: string]: ChatMember;
}

export interface ChatSettings {
	sendLess: boolean;
	autoHide: boolean;
	autoHideDelay: number;
}

export interface Chat {
	settings: ChatSettings;
	members: ChatMembers;
}

// Module overwrites
declare module "node-telegram-bot-api" {
	interface Dice {
		emoji: string;
		value: number;
	}

	interface Message {
		dice: Dice;
	}

	interface SendInvoiceOptions {
		max_tip_amount: number;
		suggested_tip_amounts: number[];
	}
}
