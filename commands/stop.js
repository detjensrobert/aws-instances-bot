const Discord = require('discord.js');
const log = require('../utils/log.js');
const config = require('../utils/config.js');
const awscli = require('../utils/cli_helper.js');

const options = {

	name: 'stop',
	aliases: ['down'],

	description: 'Starts the instance with name <name>',

	usage: '<name>',

	minArgs: 1,

};

async function execute(message, args) {
	const instance = args.shift().toLowerCase();

	const id = config.instances[`${instance}`];

	log.info(`Stopping server ${instance} (${id})`);

	if (!id) {
		log.error("Instance not found!");
		message.react('❓');
		message.react('❌');
		return;
	}

	const output = await awscli.stop(id);

	const embed = new Discord.MessageEmbed().setColor(config.colors.warn)
		.setTitle(`Stopping \`${instance}\``);
	message.channel.send(embed);

	// check every 5 seconds if
	const timeout = 6; // 30s (6 * 5000ms)
	let status;
	for (let i = 0; i < timeout && status != 'stopped'; i++) {
		await sleep(5000);
		status = (await awscli.status(id)).InstanceStatuses[0].InstanceState.Name;
	}

	if (status == 'stopped') {
		const successEmbed = new Discord.MessageEmbed().setColor(config.colors.error)
			.setTitle(`\`${instance}\` has stopped`);
		message.channel.send(successEmbed);
	}
	else {
		const errEmbed = new Discord.MessageEmbed().setColor(config.colors.warn)
			.setTitle(`\`${instance}\` failed to stop`);
		message.channel.send(errEmbed);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = options;
module.exports.execute = execute;
