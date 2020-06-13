console.log("[ START ] Starting up...");
const Discord = require('discord.js');
const client = new Discord.Client();
const log = require('./utils/log.js');

// file i/o
const fs = require('fs');

// grab settings from files
const token = process.env.BOT_TOKEN || require('./token.json').token;
const config = require('./utils/config.js');

// connect to mongodb server
// ~ const MongoClient = require('mongodb').MongoClient;
// ~ const mdbconf = require('./mongodb_config.json');
// ~ mdbconf.port = mdbconf.port || "27017";
// ~ const mongoURL = `mongodb://${mdbconf.user}:${mdbconf.pass}@${mdbconf.host}:${mdbconf.port}/`;

// import commands from dir
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

log.start("Adding commands...");
for (const file of commandFiles) {
	const command = require("./commands/" + file);
	client.commands.set(command.name, command);

	log.start("- " + command.name);
}

const cooldowns = new Discord.Collection();


// ========


client.once('ready', () => {
	log.start("Ready.");
});

client.on('message', message => {

	// ignore messages that dont start with a valid prefix
	if (!message.content.startsWith(config.prefix)) return;

	// ignore bot messages
	if (message.author.bot) return;

	// ignore DMs
	if (message.channel.type !== "text") return;

	// ignore messages not in specified channels, if given
	if (config.restrictToChannels && !config.restrictToChannels.includes(message.channel.id)) return;

	// turn message into array
	const args = message.content.trim().slice(config.prefix.length).split(/ +/);

	// pull first word (the command) out
	const commandName = args.shift().toLowerCase();

	// get command from name or alias
	const command = client.commands.get(commandName) ||
					client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;



	//   ===   CHECK COMMAND OPTIONS   ===

	// role restricted
	if (command.roleRestrict && !message.member.roles.has(config.roles[`${command.roleRestrict}`])) return;

	// argument count
	if (command.minArgs && args.length < command.minArgs) {
		const errEmbed = new Discord.MessageEmbed().setColor(config.colors.error)
			.setTitle("Oops! Are you missing something?")
			.addField("Usage:", `\`${config.prefix}${command.name} ${command.usage}\``);
		return message.channel.send(errEmbed);
	}

	// cooldown handling
	if (command.cooldown) {
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const errEmbed = new Discord.MessageEmbed().setColor(config.colors.error)
					.setTitle(`Wait ${timeLeft.toFixed(1)} more second(s) to call this again.`);
				return message.channel.send(errEmbed);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}


	// since everything's ok, execute command
	command.execute(message, args);

});


// ========


// Login to Mongo database,
// then to Discord once db is ready
// ~ log.start(`Connecting to MongoDB... ( ${mongoURL} )`);
// ~ MongoClient.connect(mongoURL, function(err, mongoclient) {
// ~ if (err) { throw err; }

// ~ client.db = mongoclient.db(mdbconf.dbname);

log.start("Logging in to Discord...");
client.login(token);
// ~ });

// catch and log promise rejections
process.on('unhandledRejection', err => log.error("Uncaught Promise Rejection!\n" + err));
