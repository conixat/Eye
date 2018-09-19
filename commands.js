//======== commands.js
//======== Commands

var Discord = require('discord.js');
var osu = require('./osu.js');
var post = require('./post.js');

async function totalpp (message, username) {
    osu.getUser(username, 1).then(
        (user) => {
            post.normalMessage(message, username + '\'s total pp', user.pp_raw);
        },
        (err) => {
            switch (err) {
                case 'J04':
                    post.errorMessage(message, 'J04', username + ' is not a registered user.');
                    return;
                case 'J05':
                    post.errorMessage(message, 'J05', '');
                    return;
                case 'J06':
                    post.errorMessage(message, 'J06', '');
                    return;
                default:
                    post.errorMessage(message, 'C00', 'Unexpected error code.');
            }
        });
    return;
};

exports.totalpp = totalpp;

async function teamAveragepp (message, teamname, team) { //team average pp
    console.log('\n'+teamname);
    console.log(team);
    var getUserPromises = [];
    var membersLength = team.members.length;
    for (let i = 0; i < membersLength; i++) {
        getUserPromises[i] = osu.getUser(team.members[i], 1);
    }
    Promise.all(getUserPromises).then(
        (users) => {
            var teamTotalpp = Number(users[0].pp_raw);
            for (let i = 1; i < team.members.length; i++) {
                teamTotalpp += Number(users[i].pp_raw);
                console.log(users[i].pp_raw);
                console.log(teamTotalpp);
            }
            var averagepp = Math.round(teamTotalpp / membersLength);
            console.log(averagepp);
            post.normalMessage(message, 'Team' + teamname + '\'s average pp', averagepp);
        },
        (err) => {
            switch (err) {
                case 'J01':
                    post.errorMessage(message, 'J01', 'A User is not found.');
                    return;
                case 'J02':
                    post.errorMessage(message, 'J02', '');
                    return;
                case 'J03':
                    post.errorMessage(message, 'J03', '');
                    return;
                default:
                    post.errorMessage(message, 'C00', 'Unexpected error code.');
            }
        }
    );
};

exports.teamAveragepp = teamAveragepp;

async function filterTopPlays (args) { //search beatmaps with specific properties

};

exports.filterTopPlays = filterTopPlays;

async function bestPlaysByMods (message, username, limit, HDSignificance = false, FLSignificance = false, Details = false) { //add beatmap details
    osu.getUserBest(username, 100).then(
        (userBest) => {
            var getBeatmapPromises = [];
            var userBestLength = userBest.length;
            for (var i = 0; i < userBestLength; i++) {
                getBeatmapPromises[i] = osu.getBeatmap(userBest[i].beatmap_id);
            }
            Promise.all(getBeatmapPromises).then(
                (beatmaps) => {
                    var HDFLPriorities = [0x00000400, 0x00000008];
                    var EZHRPriorities = [0x00000010, 0x00000002];
                    var DTValue = 0x00000040;
                    var resultedString = '';
                    
                    var ScanScores = function (i, j, k) {
                        for (let m = 0, n = 0; n < limit && m < beatmaps.length; m++) {
                            if ((!(userBest[m].enabled_mods & DTValue) == i) &&
                            ((userBest[m].enabled_mods & EZHRPriorities[0])/EZHRPriorities[0] == (j & 0x2)/2) &&
                            ((userBest[m].enabled_mods & EZHRPriorities[1])/EZHRPriorities[1] == (j & 0x1)) &&
                            ((((userBest[m].enabled_mods & HDFLPriorities[0])/HDFLPriorities[0] == (k & 0x2)/2))||(!FLSignificance)) &&
                            ((((userBest[m].enabled_mods & HDFLPriorities[1])/HDFLPriorities[1] == (k & 0x1)))||(!HDSignificance))
                            ) {
                                Details?
                                resultedString += '**' + osu.modsString(userBest[m].enabled_mods, false) + '**' + ' ' + '[' + beatmaps[m].title + ' [' + beatmaps[m].version + ']](https://osu.ppy.sh/b/' + beatmaps[m].beatmap_id + ') **' + (beatmaps[m].total_length - beatmaps[m].total_length % 60) / 60 + 'm' + beatmaps[m].total_length % 60 + 's ' + beatmaps[m].bpm + 'BPM** (CS' + beatmaps[m].diff_size + ' AR' + beatmaps[m].diff_approach + ' OD' + beatmaps[m].diff_overall + ')\n':
                                resultedString += '**' + osu.modsString(userBest[m].enabled_mods, false) + '**' + ' ' + '[' + beatmaps[m].title + ' [' + beatmaps[m].version + ']](https://osu.ppy.sh/b/' + beatmaps[m].beatmap_id + ') ' + userBest[m].maxcombo + 'x/' + beatmaps[m].max_combo +'x *' + osu.accuracy(userBest[m].count300,userBest[m].count100,userBest[m].count50,userBest[m].countmiss) + '%* ' + Math.round(userBest[m].pp) + 'pp\n';
                                n++;
                            }
                            if (resultedString.length > 1800) {
                                post.normalMessage(message, username + '\'s top plays by mods', resultedString);
                                resultedString = '';
                            }
                        }
                    };
                    var HDFLFunc = function (i, j) {
                        for (let k = 3; k >= 0 ; k--) {
                            if (!(((k & 0x2) && !FLSignificance) || ((k & 0x1) && !HDSignificance))) {
                                ScanScores(i, j, k);
                            }
                        }
                    };
                    var EZHRFunc = function (i) {
                        for (let j = 3; j >= 0; j--) {
                            HDFLFunc(i, j);
                        }
                    };
                    var DTNMFunc = function () {
                        for (let i = 0; i < 2; i++) {
                            EZHRFunc(i);
                        }
                    };
                    var ScanAllCombinations = function () {
                        DTNMFunc();
                    };

                    ScanAllCombinations();
                    post.normalMessage(message, username + '\'s top plays by mods', resultedString);

                },
                (err) => {
                    switch (err) {
                        case 'J07':
                            post.errorMessage(message, 'J07', 'A beatmap is not found.');
                            return;
                        case 'J08':
                            post.errorMessage(message, 'J08', '');
                            return;
                        case 'J08':
                            post.errorMessage(message, 'J09', '');
                            return;
                        default:
                            post.errorMessage(message, 'C00', 'Unexpected error code.');
                    }
                }
            );
        },
        (err) => {
            switch (err) {
                case 'J01':
                    post.errorMessage(message, 'J01', username + ' is not a registered user.');
                    return;
                case 'J02':
                    post.errorMessage(message, 'J02', '');
                    return;
                case 'J03':
                    post.errorMessage(message, 'J03', '');
                    return;
                default:
                    post.errorMessage(message, 'C01', 'Unexpected error code.');
            }
        });
    return;
};

exports.bestPlaysByMods = bestPlaysByMods;