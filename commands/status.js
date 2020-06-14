const Discord = require('discord.js');
const log = require('../utils/log.js');
const config = require('../utils/config.js');
const awscli = require('../utils/cli_helper.js');

const options = {

	name: 'status',
	aliases: ['check'],

	description: 'Starts the instance with name <name>',

	usage: '<name>',

	minArgs: 1,

};

async function execute(message, args) {
	const instance = args.shift().toLowerCase();

	const id = config.instances[`${instance}`];

	log.info(`Checking status of server ${instance} (${id})`);

	if (!id) {
		log.error("Instance not found!");
		message.react('❓');
		message.react('❌');
		return;
	}

	const output = await awscli.status(id);
	const state = output.InstanceStatuses[0].InstanceState.Name;

	let color;
	switch (state) {
	case 'running':
		color = config.colors.success;
		break;
	case 'stopped':
		color = config.colors.error;
		break;
	default:
		color = config.colors.info;
	}

	const embed = new Discord.MessageEmbed().setColor(color)
		.setTitle(`\`${instance}\` is ${state}`);
	message.channel.send(embed);


}

module.exports = options;
module.exports.execute = execute;
