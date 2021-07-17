import { config as dotenvConfig } from 'dotenv';

// Load .env file
dotenvConfig();

interface BotConfig {
	/**
	 * Bot Token obtained from @BotFather
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

	/**
	 * Payment Provider Token obtained from @BotFather
	 */
	paymentProviderToken: string,
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

	/**
	 * Price for buying brezls in Cents (yes, real money!)
	 */
	brezlPrice: number,
}

/**
 * Default config
 */
let config: Config = {
	bot:           {
		token:                '',
		username:             '',
		interval:             300,
		paymentProviderToken: '',
	},
	timezone:      'Europe/London',
	defaultBrezls: 25,
	brezlPrice:    85,
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
if (process.env.BOT_PAYMENT_PROVIDER_TOKEN) config.bot.paymentProviderToken = process.env.BOT_PAYMENT_PROVIDER_TOKEN;

if (process.env.TIMEZONE) config.timezone = process.env.TIMEZONE;
if (process.env.DEFAULT_BREZLS) config.defaultBrezls = parseInt(process.env.DEFAULT_BREZLS);
if (process.env.BREZL_PRICE) config.brezlPrice = parseInt(process.env.BREZL_PRICE);

// Export
export default config;