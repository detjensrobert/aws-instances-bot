# AWS Instance Started Bot

Discord bot to start and stop aws instances by name.

------------

### Usage
- `!PREFIX COMMAND USAGE`

	Description of the command here.

------------

### Setup
Main file is `bot.js`.  `npm start` will start the bot with pm2, `npm run once` will start the bot normally.

Bot token is read from envvar `BOT_TOKEN` or from file `token.json`. Create if not present:
```
{
  "token": "TOKEN_HERE"
}
```

Settings file `config.json`:
```
{
  "prefix": "!"
  
  // for the log functions, 0-4
  //   0: no logs outputted
  //   1: only ERR
  //   2: START, ERR
  //   3: START, ERR, WARN
  //   4: START, ERR, WARN, INFO
  "loglevel": "4",
  
  // color globals for RichEmbeds
  "colors": {
  }
  
  // used with the roleRestrict command parameter,
  // set roleRestrict to one of the role names set here
  "roles": {
    "<name>": "<id>"
  }
}
```
AWS instance IDs: 

------------

*Created by [detjensrobert](https://github.com/detjensrobert/aws-instances-bot) / @WholeWheatBagels#3140*
