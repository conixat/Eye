//======== reply.js
//======== Make a reply!

var post = require('./post.js');
var config = require('./config.json');

exports.introduceTheBot = function (message) {
    post.normalMessageMinimal(message, 'Message \'.c help\' for the command list.');
}

exports.commandlist = function (message) {
    post.normalMessage(message,
        'Command list',
        'A command should be prefixed by \'' + config.bot_command + ' \'.\n\
        Commands are case-sensitive.\n\
        Aliases are included in parentheses.\n\
        \n\
        **help** (h; list, l; commands, c) - Lists commands\n\
        **totalpp** (t) - Shows total pp\n\
        **mods** (m) - Shows top pp scores for each mod');
}