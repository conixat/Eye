//======== argsproc.js
//======== Arguments processing

exports.noArguments = function (args) {
    return (args.length === 0);
}

exports.oneArgument = function (args) {
    return (args.length === 1);
}

exports.argumentsMoreThan = function (args, nbr) {
    return (args.length > nbr);
}

exports.argumentsMoreThanOne = function (args) {
    return (args.length > 1);
}

exports.argumentsFewerThan = function (args, nbr) {
    return (args.length < nbr);
}