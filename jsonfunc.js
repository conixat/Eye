//======== jsonfunc.js
//======== JSON functions

var fs = require('fs');
var request = require('request');
var misc = require('./misc.js');

exports.write = function (filename, obj){
    return new Promise((resolve, reject) => {
        fs.writeFile('./' + filename + '.json', JSON.stringify(obj), (err) => {
            if(err){
                console.error(err);
                reject('J00');
            }
            resolve('./' + filename + '.json');
        });
    });
}

//Get a JSON array from URL
exports.getJSONArray = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object_array) {
                if (misc.isEmptyObject(json_object_array)) {
                    reject('J01');
                }
                if (response.statusCode !== 200) {
                    reject('J02');
                }
                if (error) {
                    reject('J03');
                }
                resolve(json_object_array);
            }
        );
        
    });
}

//Get a JSON array from URL and write a JSON file
exports.getJSONArrayAndSave = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object_array) {
                if (misc.isEmptyObject(json_object_array)) {
                    reject('J04');
                }
                if (response.statusCode !== 200) {
                    reject('J05');
                }
                if (error) {
                    reject('J06');
                }
                exports.write('osudata/' + filename, json_object_array);
                resolve('osudata/' + filename);
            }
        );
        
    });
}

//Get a JSON array and save the zeroth object
exports.getJSONArrayZeroth = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object_array) {
                if (misc.isEmptyObject(json_object_array)) {
                    reject('J07');
                } else
                if (response.statusCode !== 200) {
                    reject('J08');
                } else
                if (error) {
                    reject('J09');
                } else
                resolve(json_object_array[0]);
            }
        );
    });
}

//Get a JSON array and save the zeroth object
exports.getJSONArrayAndSaveZeroth = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object_array) {
                if (misc.isEmptyObject(json_object_array)) {
                    reject('J0a');
                } else
                if (response.statusCode !== 200) {
                    reject('J0b');
                } else
                if (error) {
                    reject('J0c');
                } else
                exports.write('osudata/' + filename, json_object_array[0]);
                resolve('osudata/' + filename);
            }
        );
    });
}

//Get a JSON object
exports.getJSON = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object) {
                if (misc.isEmptyObject(json_object)) {
                    reject('J0d');
                }
                if (response.statusCode !== 200) {
                    reject('J0e');
                }
                if (error) {
                    reject('J0f');
                }
                exports.write('osudata/' + filename, json_object);
                resolve('osudata/' + filename);
            }
        );
    });
}

//Get a JSON object and save it
exports.getJSONAndSave = function (url_string, filename) {
    return new Promise((resolve,reject) => {
        request(
            {
            url: url_string,
            json: true
            }, function (error, response, json_object) {
                if (misc.isEmptyObject(json_object)) {
                    reject('J0g');
                }
                if (response.statusCode !== 200) {
                    reject('J0h');
                }
                if (error) {
                    reject('J0i');
                }
                resolve(json_object);
            }
        );
    });
}