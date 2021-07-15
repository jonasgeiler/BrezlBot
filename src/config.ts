import { config as dotenvConfig } from 'dotenv';

// Load .env file
dotenvConfig();

interface BotConfig {
	/**
	 * Bot Token
	 */
	token: string,

	/**
	 * Bot Username
	 */
	username: string,

	/**
	 * Interval between requests in milliseconds
	 */
	interval: number,
}

interface Config {
	/**
	 * Bot config
	 */
	bot: BotConfig

	/**
	 * Timezone for scheduled jobs
	 */
	timezone: string,

	/**
	 * Default brezl amount for every user
	 */
	defaultBrezls: number,
}

/**
 * Default config
 */
let config: Config = {
	bot: {
		token: '',
		username: '',
		interval: 300
	},
	timezone:            'Europe/London',
	defaultBrezls:       25,
};

// Set each environment variable:
if (process.env.BOT_TOKEN) {
	config.bot.token = process.env.BOT_TOKEN;
} else {
	console.error('BOT_TOKEN not defined in .env file');
	process.exit(5);
}
if (process.env.BOT_USERNAME) {
	config.bot.username = process.env.BOT_USERNAME;
} else {
	console.error('BOT_USERNAME not defined in .env file');
	process.exit(5);
}
if (process.env.BOT_INTERVAL) config.bot.interval = parseInt(process.env.BOT_INTERVAL);
if (process.env.TIMEZONE) config.timezone = process.env.TIMEZONE;
if (process.env.DEFAULT_BREZLS) config.defaultBrezls = parseInt(process.env.DEFAULT_BREZLS);

// Export
export default config;