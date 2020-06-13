const Discord = require('discord.js');
const { log } = require('../utils/log.js');

const options = {

	name: 'set',
	aliases: ['setting', 'config'],

	description: 'Allows admins to view and set settings properties. Call with no value to see the \nSupported settings: prefix, roles',

	usage: `<setting.path> <new value>`,

	minArgs: 2,

	roleRestrict: 'admin',
};

async function execute(message, args) {

	const path = args.shift();
	const value = args.join(' ');


	log.info(`Setting setting ${path} to "${value}" `);

}


module.exports = options;
module.exports.execute = execute;
