import TelegramBot from "node-telegram-bot-api";
import config from "./config";
import * as handlers from "./handlers";
import * as jobs from "./jobs";
import "./types";

// Init telegram bot
const bot = new TelegramBot(config.bot.token, {
	polling: {
		interval: config.bot.interval,
	},
});

// Register all handlers
for (const [handlerName, handler] of Object.entries(handlers)) {
	handler(bot);

	console.log(`Handler "${handlerName}" registered.`);
}

// Start all scheduled jobs
for (const [jobName, job] of Object.entries(jobs)) {
	(job as (bot?: TelegramBot) => void)(bot);

	console.log(`Job "${jobName}" scheduled.`);
}
