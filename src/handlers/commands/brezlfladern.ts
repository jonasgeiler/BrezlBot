import type TelegramBot from "node-telegram-bot-api";
import {
	commandRegex,
	getBrezls,
	getLastRobbery,
	getRandomInt,
	isForwarded,
	isFromUser,
	isGroupMessage,
	sendMessage,
	setBrezls,
	setLastRobbery,
	storeUser,
	wait,
} from "../../utils";

export default (bot: TelegramBot): void => {
	bot.onText(commandRegex("brezlfladern"), async (msg) => {
		if (!isGroupMessage(msg) || !isFromUser(msg) || isForwarded(msg)) {
			return;
		}

		storeUser(msg.chat.id, msg.from);

		// Check if last robbery was less than a week ago
		if (
			Date.now() - getLastRobbery(msg.chat.id, msg.from.id) <=
			24 * 60 * 60 * 1000
		) {
			await sendMessage(
				bot,
				msg,
				`De Behördn suchn no noch dia!
<b>Du musst oan Dog wardn bis du wieda Brezl fladern kannst!</b>`,
				`I spüre do a stoake kriminelle Energie... &#x1F9D0;`,
				{ removeButtonText: "Schade" },
			);

			return;
		}

		// Wait 1 second
		await bot.sendChatAction(msg.chat.id, "typing");
		await wait(1000);

		const rewardList = [];

		// 10 is max reward
		for (let i = 0; i <= 10; i++) {
			for (let j = 0; j < Math.abs(i - 11); j++) {
				rewardList.push(i);
			}
		}

		const reward = rewardList[getRandomInt(0, rewardList.length - 1)];

		// 0: Der Standbesitzer hat dich erwischt und du konntest keine Brezeln fladern.
		// 1: Der Standbesitzer hat dich erwischt, aber aus Mitleid gab er dir 1 Brezl umsonst.
		// 2: Der Standbesitzer hat dich erwischt, aber er war ein bisschen angesoffen und hat die 2 Brezln hinter deinem Rücken nicht bemerkt.
		// 3-4: Ein anderer Kunde hat dich erwischt, aber du hast es geschafft, mit 3 Brezln zu entkommen, bevor er den Standbesitzer alarmiert hat.
		// 5: Ein anderer Kunde hat dich erwischt, aber du konntest ihn überzeugen, dir für die Hälfte deiner Beute zu helfen. Du bist mit 5 Brezeln nach Hause gegangen.
		// 6: Du warst erfolgreich, aber auf deiner Flucht wurdest du von einem Auto angefahren und so hattest du am Ende nur noch 6 Brezln.
		// 7: Du warst erfolgreich, aber dein Fluchtweg führte durch das Festzelt und so hattest du am Ende nur noch 7 Brezln.
		// 8: Du warst erfolgreich, aber auf deiner Flucht bist du hingefallen und so hattest du am Ende nur noch 8 Brezln.
		// 9: Du konntest alle Brezeln klauen, aber du wurdest ein bisschen hungrig und so hattest du am Ende nur noch 9 Brezln.
		// 10: Du hast es geschafft, alle Brezeln zu stehlen! Niemand hat dich bemerkt und du bist mit 10 Brezeln nach Hause gegangen.

		let text =
			"Du vasuchst auf am Oktobafest a boah Brezln zua fladern! &#x1F608;&#x1F968;\n\n";
		let comment: string;
		let removeButtonText: string | undefined;
		switch (reward) {
			case 0:
				text += `<b>Da Standbesitza hod di eawischt und du konntest kane Brezeln fladern.</b>`;
				comment = `Servus? Polizei? I mog a Stroftod meldn!!! &#x1F694;`;
				removeButtonText = "Vadammte Scheise!!!";
				break;

			case 1:
				text += `<b>Da Standbesitza hod di eawischt, aba aus Mitleid gob ea dia <code>1</code> Brezl umsonst.</b>`;
				comment = `Ned draurig sein, Burli! &#x1F625;`;
				removeButtonText = "Scheise!";
				break;

			case 2:
				text += `<b>Da Standbesitza hod di eawischt, aba ea war a bissal ogsoffa und hod de <code>2</code> Brezln hinta deim Ruggn ned bemerkt!</b>`;
				comment = `Melkt da Baua sein Stia, drank da Drottl zua vui Bier! &#x1F37A;`;
				removeButtonText = "Och komm schon...";
				break;

			case 3:
			case 4:
				text += `<b>A andera Kunde hod di eawischt, aba du hosd 's gschofft, mid <code>${reward}</code> Brezln zua entkomma, bevoa ea den Standbesitza olarmiad hod.</b>`;
				comment = `Lauf, Burli, lauf! &#x1F3C3;`;
				removeButtonText = "Na Immerhin.";
				break;

			case 5:
				text += `<b>A andera Kunde hod di eawischt, aba du konntest ihn übazeign, dia fia de Häiftn doana Brezln zua helfn. Du bisd mid <code>5</code> Brezeln Hoam gangn.</b>`;
				comment = `Mitanand gäd vuis leichta! &#x1F46C;`;
				removeButtonText = "Supa!";
				break;

			case 6:
				text += `<b>Du warst eafolgreich, aba auf doana Flucht wurdest du vo am Auto ogfahrn und so hattest du am End grod no <code>6</code> Brezln.</b>`;
				comment = `Wia hosd du des übalebt?! &#x1F631;&#x1F62C;`;
				removeButtonText = "Aua scheise!";
				break;

			case 7:
				text += `<b>Du warst eafolgreich, aba dei Fluchtweg führte duach des Festzelt und so hattest du am End grod no <code>7</code> Brezln.</b>`;
				comment = `Griag i vuileicht aa eins vo dei Brezln? &#x1F968;`;
				removeButtonText = "Schade";
				break;

			case 8:
				text += `<b>Du warst eafolgreich, aba auf doana Flucht bisd du higfoien und so hattest du am End grod no <code>8</code> Brezln.</b>`;
				comment = `Soi i dia a Bussi auf de Wunde gebn? &#x1F625;`;
				removeButtonText = "Aua!";
				break;

			case 9:
				text += `<b>Du konntest olle Brezeln fladern, aba du wurdest a bissal hungrig und so hattest du am End grod no <code>9</code> Brezln.</b>`;
				comment = `An Guadn! I hoff ea hod gschmeckt! &#x1F924;`;
				removeButtonText = "Mmmmh!";
				break;

			case 10:
				text += `<b>Du hosd 's gschofft, olle Brezeln zua fladern! Niemand hod di bemerkt und du bisd mid <code>10</code> Brezeln Hoam gangn.</b>`;
				comment = `Wos kimmd ois nächtes? A Ba-Ba-Bankübafoi? &#x1F4B0;&#x1F911;`;
				removeButtonText = "Sau Geil!!!";
				break;
		}

		// Update brezls
		const brezls = getBrezls(msg.chat.id, msg.from.id);
		setBrezls(msg.chat.id, msg.from.id, brezls + reward);

		// Update last robbery time
		setLastRobbery(msg.chat.id, msg.from.id, Date.now());

		await sendMessage(bot, msg, text, comment, { removeButtonText });
	});
};
