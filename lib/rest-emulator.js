var merge = require('./merge');
var normalize = require('./normalize');

var parseUrl = require('parseurl');
var _ = require('lodash');

exports = module.exports = restEmulator;

function restEmulator(listMockConfig) {

    var config;

    if (!listMockConfig) {
        throw new TypeError('restEmulator() mock config required');
    }

    if (!_.isArray(listMockConfig)) {
        listMockConfig = _.toArray(listMockConfig);
    }

    config = _.reduce(listMockConfig, getNormalizeConfig, {});
    console.info('Mock urls: ', _.keys(config));

    return middleware;

    function middleware(req, res, next) {
        var url = parseUrl(req);
        var preset;

        if (!_.contains(_.keys(config), url.pathname)) {
            return next();
        }

        preset = getCurrentPreset(req, config[url.pathname]);

        if (preset) {
            setTimeout(timeout, preset.timeout);
        } else {
            return next();
        }

        function timeout() {
            res.statusCode = preset.code;
            res.write(JSON.stringify(preset.data));
            res.end();
        }
    }

    function getCurrentPreset(req, methods) {
        var presets = methods[req.method];
        var query = require('url').parse(req.url, true).query;
        var presetName = query.restEmulatorPreset || 'default';
        return presets ? presets[presetName] : false;
    }

    function getNormalizeConfig(config, rawConfig) {
        return merge(config, normalize(rawConfig));
    }
}
