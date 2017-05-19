var merge = require('./merge');
var normalize = require('./normalize');
var parseUrl = require('parseurl');
var _ = require('lodash');
var config;
var errorResponse = {
    code: 400,
    data: {
        error: true,
        message: 'Request body not equal request expected'
    }
};

exports = module.exports = restEmulator;

function restEmulator(listMockConfig, options) {

    options = options || {};

    updateConfig(listMockConfig);

    log('Mock urls: ', _.keys(config));
    log('Mock data:', config);

    return {
        middleware: middleware,
        updateConfig: updateConfig
    };

    function updateConfig(listMockConfig) {
        if (!listMockConfig) {
            throw new TypeError('restEmulator() mock config required');
        }

        if (!_.isArray(listMockConfig)) {
            listMockConfig = _.toArray(listMockConfig);
        }

        config = _.reduce(listMockConfig, getNormalizeConfig, {});
    }

    function middleware(req, res, next) {
        var url = parseUrl(req);
        var preset,
            request;

        var route   = _.find(_.keys(config), function(route) {
            var uri = route.replace(/(\/\:([^\/]+))/g, '/.+');
                uri = uri.replace(/\//g, '\\/');

            return  (new RegExp(uri).test(url.pathname))
                    ? route
                    : false;
        });

        if (!route) {
            return next();
        }


        preset  = getCurrentPreset(req, config[route]);
        request = preset.request || {};

        if (request.body && Object.keys(request.body).length) {
            var status = validateBody(request.body, req.body);

            if (status === false || !(req.body && Object.keys(req.body).length)) {
                var errorPreset = _.clone(preset, false);
                errorPreset.code = request.error && request.error.code || errorResponse.code;
                errorPreset.data = request.error && request.error.data || errorResponse.data;
                return response(errorPreset);
            }
        }

        if (preset) {
            setTimeout(timeout, preset.timeout);
        } else {
            return next();
        }

        function timeout() {
            if (_.keys(preset.query).length && _.keys(req.query).length) {
                var querystring = require('querystring');

                var queryData = _.find(preset.query, function(data, keyQuery) {
                    var remoteQuery = req.query;
                    var presetQuery = querystring.parse(keyQuery);

                    return _.isEqual(remoteQuery, presetQuery);
                });

                if (queryData) {
                    return response(queryData);
                }

            }
            return response(preset);
        }

        function response(preset) {
            if (preset.headers) {
                res.set(preset.headers);
            }
            res.statusCode = preset.code;
            var data;
            if (preset.raw) {
                data = preset.data;
            } else {
                if (typeof preset.data === "function") {
                    data = JSON.stringify(preset.data(req));
                } else {
                    data = JSON.stringify(preset.data);
                }
            }
            res.write(data);
            res.end();
            return true;
        }
    }

    function getCurrentPreset(req, methods) {
        var presets = methods[req.method];
        var query = require('url').parse(req.url, true).query;
        var presetName = query.restEmulatorPreset || 'default';
        return presets ? presets[presetName] : false;
    }

    function validateBody(presetBody, requestBody) {
        var status = true;

        for (var key in presetBody) {
            if (status === false) {
                break;
            }

            if (requestBody[key] === undefined) {
                status = false;
            }

            if (requestBody[key] !== undefined && presetBody[key] !== '*') {
                status  = (requestBody[key] != presetBody[key])
                        ? false
                        : true;
            }
        }

        return status;
    };

    function getNormalizeConfig(config, rawConfig) {
        return merge(config, normalize(rawConfig));
    }

    function log(message, data) {
        if (options.verbose) {
            console.log(message, data);
        }
    }
}
