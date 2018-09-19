/*
Filename: index.js
Description: Eye is a Discord bot designed for osu!

====== DEPENDENCIES =======
request.js //get string from url
discord.js //Discord API wrapper

========== FILES ==========
config.json
osudata/(json files)

[INDEX.JS]                    Commands
  |- reply.js                 Makes a reply
  |- argsproc.js              Processes arguments
  |- recv.js                  Processes the received message        
  |- osu.js                   osu!api & general osu functions         
  |- jsonfunc.js              JSON-related functions                  
  |- misc.js                  Miscellaneous functions                   
  |- post.js                  Sends messages on a channel       
  `- embed.js                 Sends embeds on a channeL         
*/

//======== botc.js
//======== Entry point

//Modules
//discord.js
var Discord = require('discord.js');

//Bot C modules
var post = require('./post.js');
var JSONfunc = require('./jsonfunc.js');
var reply = require('./reply.js');
var argsproc = require('./argsproc.js');
var recv = require('./recv.js');
var osu = require('./osu.js');
var commands = require('./commands.js');

//===========================================================================
//config
//bot_token
//bot_command
//api_key
//owner_id
//bot_color

var config = require('./config.json');

//===========================================================================
//This bot interacts with Discord using discord.js
const client = new Discord.Client();

//===========================================================================
//Shows successful login
client.on('ready', () => {
    console.log('Logged in as \''+client.user.username+'\'')
});

//A message is received
client.on('message', (message) =>{
    //Preliminary check & arguments extraction
    if (message.author.bot || !message.content.startsWith(config.bot_command)) return; //Bot check & initial bot_command check
    var args = message.content.trim().split(/ +/g);//Extract args
    if (args.shift() !== config.bot_command) return; //bot_command check
    if (argsproc.noArguments(args)) { //Check if any command is provided
        reply.introduceTheBot(message);
        return;
    }
    var command = args.shift();//Shift args and extract the command

    switch (command) {
        case 'totalpp':
        case 't':
            {
                if (argsproc.noArguments(args)) {
                    post.warningMessage(message, 'I00', 'Please specify a player.');
                    return;
                }
                commands.totalpp(message, args.join(' '));
                return;
            }
        /*
        case 'test':
            {
                testAsync(message);
                return;
            }
        */
        case 'help':
        case 'h':
        case 'list':
        case 'l':
        case 'commands':
        case 'c':
            reply.commandlist(message);
            return;
        case 'mods':
        case 'm':
            if (argsproc.noArguments(args)) {
                post.warningMessage(message, 'I01', 'Please specify a player.');
                return;
            }
            var indexOfHD = args.indexOf('.hd'); //make a function for searching arguments starting with '.' & put all these into the command function in commands.js!!!
            var HDSig;
            if (indexOfHD > -1) {
                if (args.length < indexOfHD + 2) {
                    post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.hd\'.');
                }
                switch (args[indexOfHD+1]) {
                    case '0':
                        HDSig = 0;
                        break;
                    case '1':
                        HDSig = 1;
                        break;
                    default :
                        post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.hd\'.');
                        return;
                }
                args.splice(indexOfHD,2);
            }
            var indexOfFL = args.indexOf('.fl');
            var FLSig;
            if (indexOfFL > -1) {
                if (args.length < indexOfFL + 2) {
                    post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.fl\'.');
                }
                switch (args[indexOfFL+1]) {
                    case '0':
                        FLSig = 0;
                        break;
                    case '1':
                        FLSig = 1;
                        break;
                    default :
                        post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.fl\'.');
                        return;
                }
                args.splice(indexOfFL,2);
            }
            var indexOfDetails = args.indexOf('.d');
            var Details;
            if (indexOfDetails > -1) {
                if (args.length < indexOfDetails + 2) {
                    post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.d\'.');
                }
                switch (args[indexOfDetails+1]) {
                    case '0':
                        Details = 0;
                        break;
                    case '1':
                        Details = 1;
                        break;
                    default :
                        post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.d\'.');
                        return;
                }
                args.splice(indexOfDetails,2);
            }
            var indexOfLimit = args.indexOf('.l');
            var Limit;
            if (indexOfLimit > -1) {
                if (args.length < indexOfLimit + 2) {
                    post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.l\'.');
                }
                if (!(/^[1-9]\d*$/.test(args[indexOfLimit+1]))) {
                    post.warningMessage(message, 'I02', 'A \'0\' or \'1\' is expected after \'.l\'.');
                }
                Limit = args[indexOfLimit+1];
                args.splice(indexOfLimit,2);
            }
            commands.bestPlaysByMods(message, args.join(' '), Limit, HDSig, FLSig, Details);
            return;
        default:
            if(!recv.isOwner(message)) { //Non-owner & command validity check
                post.warningMessage(message, '09', command + ' is not a recognized command or you are not authorized to use it.');
                return;
            }
    }
    
    //Owner-specific commands
    switch (command) {
        case 'invokewith': //Change bot_command
        case 'iw':
            if (!argsproc.oneArgument(args)) { //No-space check
                post.warningMessage(message, 'Z0', 'No space is allowed.');
                return;
            }
            config.bot_command = args[0];
            JSONfunc.write('config', config);
            post.normalMessageMinimal(message, 'New bot_command: ' + config.bot_command);
            return;
        case 'colour':
        case 'color': //Change color
        case 'k':
            if (!argsproc.oneArgument(args)) { //one arg
                post.warningMessage(message, 'Z0', 'Please provide one hex colour (RRGGBB).');
                return;
            }
            if (!(/^[A-Fa-f0-9]{6}$/.test(args[0]))) { //hex colour
                post.warningMessage(message, 'Z0', 'Please provide one hex colour (RRGGBB).');
                return;
            }
            config.bot_color = args[0];
            JSONfunc.write('config', config);
            return;
        default:
            post.normalMessageMinimal(message, 'No such command. (' + command + ')'); //'not a valid command'
            return;
    }
    
    
});

//Login
client.login(config.bot_token);