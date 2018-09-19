//======== recv.js
//======== Processes a received message

var Discord = require('discord.js')
var config = require('./config.json');

exports.isOwner = function (message) {
    return (message.author.id === config.owner_id) ? true : false;
}