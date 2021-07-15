import { scheduleJob } from '../utils';

export default () => {
	scheduleJob('1h', () => {
		console.log('Inflate!');
	});
};