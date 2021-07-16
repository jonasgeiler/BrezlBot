import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import * as handlers from './handlers';
import * as jobs from './jobs';
import './types';

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
for (let [handlerName, handler] of Object.entries(handlers)) {
	handler(bot);

	console.log(`Handler "${handlerName}" registered.`);
}

// Start all scheduled jobs
for (let [jobName, job] of Object.entries(jobs)) {
	// @ts-ignore because some jobs don't require the bot as parameter
	job(bot);

	console.log(`Job "${jobName}" scheduled.`);
}
