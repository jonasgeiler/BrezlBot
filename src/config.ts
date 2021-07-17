import { config as dotenvConfig } from "dotenv";

// Load .env file
dotenvConfig();

interface BotConfig {
	/**
	 * Bot Token obtained from @BotFather
	 */
	token: string;

	/**
	 * Bot Username
	 */
	username: string;

	/**
	 * Interval between requests in milliseconds
	 */
	interval: number;

	/**
	 * Payment Provider Token obtained from @BotFather
	 */
	paymentProviderToken: string;
}

interface Config {
	/**
	 * Bot config
	 */
	bot: BotConfig;

	/**
	 * Timezone for scheduled jobs
	 */
	timezone: string;

	/**
	 * Default brezl amount for every user
	 */
	defaultBrezls: number;

	/**
	 * Price for buying brezls in Cents (yes, real money!)
	 */
	brezlPrice: number;
}

/**
 * Default config
 */
const config: Config = {
	bot: {
		token: "",
		username: "",
		interval: 300,
		paymentProviderToken: "",
	},
	timezone: "Europe/London",
	defaultBrezls: 25,
	brezlPrice: 85,
};

type EnvData = { key: string; type: "string" | "number" };
function ensureEnv<Target>(
	target: Record<keyof Target, unknown>,
	template: Partial<Record<keyof Target, string | EnvData>>,
) {
	Object.entries(template).forEach(([configKey, envData]) => {
		let transformFn = null;
		let envValue = "";
		if (typeof envData === "string") {
			envValue = process.env[envData as string] as string;
		} else {
			const { key, type } = envData as EnvData;
			envValue = process.env[key] as string;
			if (type === "number") {
				transformFn = (v: string) => parseInt(v, 10);
			}
		}

		if (!envValue) {
			console.error(`Missing environment variable "${configKey}"`);
			process.exit(5);
		}

		target[configKey] = transformFn ? transformFn(envValue) : envValue;
	});
}

ensureEnv<BotConfig>(config.bot, {
	token: "BOT_TOKEN",
	username: "BOT_USERNAME",
	paymentProviderToken: "BOT_PAYMENT_PROVIDER_TOKEN",
	interval: {
		key: "BOT_INTERVAL",
		type: "number",
	},
});

ensureEnv<Config>(config, {
	defaultBrezls: {
		key: "DEFAULT_BREZLS",
		type: "number",
	},
	brezlPrice: {
		key: "BREZL_PRICE",
		type: "number",
	},
	timezone: "TIMEZONE",
});

// Export
export default config;
