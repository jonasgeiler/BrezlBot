import { scheduleJob } from '../utils';

export default () => {
	scheduleJob('24h', () => {
		console.log('Inflate!');
	});
};