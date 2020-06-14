const Discord = require('discord.js');
const log = require('../utils/log.js');
const config = require('../utils/config.js');
const awscli = require('../utils/cli_helper.js');

const options = {

	name: 'start',
	aliases: ['up'],

	description: 'Starts the instance with name <name>',

	usage: '<name>',

	minArgs: 1,

};

async function execute(message, args) {
	const instance = args.shift().toLowerCase();

	const id = config.instances[`${instance}`];

	log.info(`Starting server ${instance} (${id})`);

	if (!id) {
		log.error("Instance not found!");
		message.react('❓');
		message.react('❌');
		return;
	}

	const output = await awscli.start(id);

	const embed = new Discord.MessageEmbed().setColor(config.colors.warn)
		.setTitle(`Starting \`${instance}\``);
	message.channel.send(embed);
}

module.exports = options;
module.exports.execute = execute;
