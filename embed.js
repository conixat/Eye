//======== embed.js
//======== Simple embeds

var Discord = require('discord.js');

exports.minimalEmbed = function (message, color, text) {
    var embed = new Discord.RichEmbed()
        .setColor(color)
        .setDescription(text);
    message.channel.send({embed});
}

exports.simpleEmbed = function (message, color, title, text) {
    var embed = new Discord.RichEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(text);
    message.channel.send({embed});
}
