//======== post.js
//======== Post a message

var embed = require('./embed.js');
var config = require('./config.json');

exports.normalMessageMinimal = function (message, text) {
    embed.minimalEmbed(message, config.bot_color, text);    
}

exports.normalMessage = function (message, title, text) {
    embed.simpleEmbed(message, config.bot_color, title, text);
}

exports.presetMessageTrailing = function (message, color, preset, title, text) {
    if (text === '') {
        embed.simpleEmbed(message, color, title, preset);
        return;
    }
    embed.simpleEmbed(message, color, title, text + '\n(' + preset + ')');
}

exports.presetMessageDefault = function (message, color, preset, title, text) {
    if (text === '') {
        embed.simpleEmbed(message, color, title, preset);
        return;
    }
    embed.simpleEmbed(message, color, title, text);
}

exports.warningMessage = function (message, code, description) {
    exports.presetMessageTrailing(message,
        0xffff00,
        'Contact Coni if you believe the bot is not working properly.',
        'W-' + code,
        description
    );
}

exports.errorMessage = function (message, code, description) {
    exports.presetMessageDefault(message,
        0xff0000,
        'An error has occurred.',
        'E-' + code,
        description
    );
}