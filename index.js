var path = require('path');
var dust = require('dustjs-linkedin');

module.exports = function (content) {
    if (this.cacheable) {
        this.cacheable();
    }

    var partials = [];
    var partialRegExp = /\{>[^"]*"([^"]*)/g;
    var match;

    while (match = partialRegExp.exec(content)) {
        partials.push(match[1]);
    }

    var dependencies = partials.filter(function (partial) {
        return partial.indexOf('{') < 0;
    }).reduce(function (result, partial) {
        return result + "require('" + partial + ".dust');\n";
    }, '');

    var name = this.resourcePath.replace(this.options.context + path.sep, '').replace('.dust', '').split(path.sep).join('/'),
        compiled = dust.compile(content, name);

    return dependencies + "module.exports = " + compiled;
};