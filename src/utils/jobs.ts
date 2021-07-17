import { isNumeric } from "../utils";

export function scheduleJob(
	time: number | string,
	job: () => void,
): NodeJS.Timer {
	let millis: number;

	if (typeof time === "number") {
		millis = time;
	} else {
		if (isNumeric(time)) {
			millis = parseInt(time, 10);
		} else {
			const num = parseInt(time.slice(0, -1), 10);
			const unit = time.substr(-1);

			if (unit === "s") {
				millis = num * 1000;
			} else if (unit === "m") {
				millis = num * 60 * 1000;
			} else if (unit === "h") {
				millis = num * 60 * 60 * 1000;
			} else {
				millis = num;
			}
		}
	}

	return setInterval(job, millis);
}
