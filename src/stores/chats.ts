import Enmap from 'enmap';

// @ts-ignore
export const Chats = new Enmap('chats', {
	fetchAll:   false,
	autoFetch:  true,
	autoEnsure: {
		settings: {
			sendLess:      false,
			autoHide:      false,
			autoHideDelay: 15,
		},
		members:  {},
	},
});