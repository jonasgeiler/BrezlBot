import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import * as handlers from './handlers';
import * as jobs from './jobs';

// Init telegram bot
const bot = new TelegramBot(
	config.bot.token,
	{
		polling: {
			interval: config.bot.interval,
		},
	},
);

// Register all handlers
for (let handler of Object.values(handlers)) {
	handler(bot);
}

// Start all scheduled jobs
for (let job of Object.values(jobs)) {
	// @ts-ignore because some jobs don't require the bot as parameter
	job(bot);
}
