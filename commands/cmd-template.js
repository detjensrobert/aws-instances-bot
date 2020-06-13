const Discord = require('discord.js');
const { log } = require('../utils/log.js');

const options = {

	name: 'CMD_NAME',
	aliases: ['ALIAS1', 'A2'],

	description: 'DESCRIPTION',

	usage: 'USAGE',

	cooldown: 3,
	minArgs: 1,

	roleRestrict: 'ROLE_NAME',
};

async function execute(message, args) {
	const config = message.client.config;

	log.info("Executing template command...");

	const embed = new Discord.MessageEmbed().setColor(config.color.success)
		.setTitle("Template command!")
		.addField("Args:", args.join(', '));

	message.channel.send(embed);
}

module.exports = options;
module.exports.execute = execute;
