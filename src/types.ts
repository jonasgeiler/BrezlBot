export interface ChatMember {
	id: number,
	name: string,
	brezls: number,
}

export interface ChatSettings {
	sendLess: boolean,
	autoHide: boolean,
	autoHideDelay: number,
}