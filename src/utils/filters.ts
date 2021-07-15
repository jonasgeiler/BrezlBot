import { Message } from 'node-telegram-bot-api';

export const isGroupMessage = (msg: Message): boolean => msg.chat.type === 'group' || msg.chat.type === 'supergroup';

export const isPrivateMessage = (msg: Message): boolean => msg.chat.type === 'private';

export const isFromUser = (msg: Message): boolean => !!msg.from && !msg.from.is_bot;

export const isForwarded = (msg: Message): boolean => !!msg.forward_from;