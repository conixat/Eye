//======== osu.js
//======== osu!api and osu-related functions

var JSONfunc = require('./jsonfunc.js');
var config = require('./config.json');

//===========================================================================
//General osu functions
exports.accuracy = function (n_300,n_100,n_50,n_0) {
    return Math.round(10000*(50*n_50+100*n_100+300*n_300)/(300*n_0+300*n_50+300*n_100+300*n_300))/100; //Multiplied individually to ensure the arguments are all numbers
}

exports.modsString = function (mods_value, full = false) {
    if (mods_value == 0x00000000) {
        return full? 'NodMod': 'NM';
    }
    let resultedString = (
        ((mods_value & 0x00001000) ? (full? 'SpunOut,':        'SO'): '') +
        ((mods_value & 0x00000002) ? (full? 'Easy,':           'EZ'): '') +
        ((mods_value & 0x00000001) ? (full? 'NoFail,':         'NF'): '') +
        ((mods_value & 0x00000008) ? (full? 'Hidden,':         'HD'): '') +
        ((mods_value & 0x00000040) ? (full? 'DoutbleTime,':    'DT'): '') +
        ((mods_value & 0x00000200) ? (full? 'Nightcore,':      'NC'): '') +
        ((mods_value & 0x00000100) ? (full? 'HalfTime,':       'HT'): '') +
        ((mods_value & 0x00000010) ? (full? 'HardRock,':       'HR'): '') +
        ((mods_value & 0x00000020) ? (full? 'SuddenDeath,':    'SD'): '') +
        ((mods_value & 0x00000400) ? (full? 'Flashlight,':     'FL'): '') +
        ((mods_value & 0x00000080) ? (full? 'Relax,':          'RX'): '') +
        ((mods_value & 0x00000004) ? (full? 'TouchDevice,':    'TD'): '') +
        ((mods_value & 0x00000800) ? (full? 'Autoplay,':       'AUTO'): '') +
        ((mods_value & 0x00002000) ? (full? 'AutoPilot,':      'AP'): '') +
        ((mods_value & 0x00004000) ? (full? 'Perfect,':        'PF'): '') +
        ((mods_value & 0x00008000) ? (full? '4K,':             '4K'): '') +
        ((mods_value & 0x00010000) ? (full? '5K,':             '5K'): '') +
        ((mods_value & 0x00020000) ? (full? '6K,':             '6K'): '') +
        ((mods_value & 0x00040000) ? (full? '7K,':             '7K'): '') +
        ((mods_value & 0x00080000) ? (full? '8K,':             '8K'): '') +
        ((mods_value & 0x00100000) ? (full? 'FadeIn,':         'FI'): '') +
        ((mods_value & 0x00200000) ? (full? 'Random,':         'RD'): '') +
        ((mods_value & 0x00400000) ? (full? 'Cinema,':         'CN'): '') +
        ((mods_value & 0x00800000) ? (full? 'Target,':         'TG'): '') +
        ((mods_value & 0x01000000) ? (full? '9K,':             '9K'): '') +
        ((mods_value & 0x02000000) ? (full? 'KeyCoop,':        'KC'): '') +
        ((mods_value & 0x04000000) ? (full? '1K,':             '1K'): '') +
        ((mods_value & 0x08000000) ? (full? '3K,':             '3K'): '') +
        ((mods_value & 0x10000000) ? (full? '2K,':             '2K'): '') +
        ((mods_value & 0x20000000) ? (full? 'ScoreV2,':        'V2'): '') +
        ((mods_value & 0x40000000) ? (full? 'LastMod,':        'LM'): '') +
        ((mods_value & 0x80000000) ? (full? 'Undefined,':      'Undefined'): '')
    );
    return full? resultedString.substring(0, resultedString.length - 1): resultedString;
}

//===========================================================================
//osu!api
exports.getBeatmap = function (beatmap_id) {
    return JSONfunc.getJSONArrayZeroth(
        'https://osu.ppy.sh/api/get_beatmaps?k=' + config.api_key + '&mode=0&b=' + beatmap_id,
        beatmap_id
    );
}

exports.getBeatmapAndSave = function (beatmap_id) {
    return JSONfunc.getJSONArrayAndSaveZeroth(
        'https://osu.ppy.sh/api/get_beatmaps?k=' + config.api_key + '&mode=0&b=' + beatmap_id,
        beatmap_id
    );
}

//get_user
exports.getUser = function (username, event_days) {
    return JSONfunc.getJSONArrayZeroth(
        'https://osu.ppy.sh/api/get_user?k=' + config.api_key + '&u=' + username + '&mode=0&type=string&event_days=' + event_days,
        username
    );
}

exports.getUserAndSave = function (username, event_days) {
    return JSONfunc.getJSONArrayAndSaveZeroth(
        'https://osu.ppy.sh/api/get_user?k=' + config.api_key + '&u=' + username + '&mode=0&type=string&event_days=' + event_days,
        username
    );
}

//get_user_best
exports.getUserBest = function (username, limit) {
    return JSONfunc.getJSONArray(
        'https://osu.ppy.sh/api/get_user_best?k=' + config.api_key + '&u=' + username + '&mode=0&type=string&limit=' + limit,
        username
    );
}

exports.getUserBestAndSave = function (username, limit) {
    return JSONfunc.getJSONArrayAndSave(
        'https://osu.ppy.sh/api/get_user_best?k=' + config.api_key + '&u=' + username + '&mode=0&type=string&limit=' + limit,
        username
    );
}
