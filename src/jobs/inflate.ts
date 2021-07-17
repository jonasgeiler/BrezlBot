import { scheduleJob } from "../utils";

export default (): void => {
	scheduleJob("24h", () => {
		console.log("Inflate!");
	});
};
