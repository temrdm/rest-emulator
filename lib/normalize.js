var _ = require('lodash');

exports = module.exports = getNormalizeConfig;

module.exports.getNormalizeMethods = getNormalizeMethods;
module.exports.getNormalizePresets = getNormalizePresets;

function getNormalizeConfig(config) {
    return _.transform(config, transform, {});

    function transform(result, data, url) {
        url = getNormalizeUrl(url);
        data = getNormalizeMethods(data);
        data ? result[url] = data : false;
    }
}

function getNormalizeMethods(data) {
    var normalize;
    var preset;
    var methods = getAvailableMethods(data);

    if (methods.length) {
        normalize = _.transform(methods, transform, {});
        return _.keys(normalize).length ? normalize : false;
    } else {
        return getDefaultMethod(getNormalizePresets(data));
    }

    function transform(result, method) {
        preset = getNormalizePresets(data[method]);
        preset ? result[method] = preset : false;
    }
}

function getNormalizePresets(data) {
    var normalize;
    var response;
    var presets = getAvailablePresets(data);

    if (presets.length) {
        normalize = _.transform(presets, transform, {});
        return _.keys(normalize).length ? normalize : false;
    } else {
        return getDefaultPreset(getNormalizeResponse(data));
    }

    function transform(result, preset) {
        response = getNormalizeResponse(data[preset]);
        response ? result[preset] = response : false;
    }

}

function getNormalizeResponse(data) {
    if (!data.data && !data.code) {
        return false;
    }
    data.data = data.data || {};
    data.code = data.code || 200;
    data.timeout = parseInt(data.timeout) || 0;
    if (data.query) {
        data.query = _.mapValues(data.query, function(value){
            value.data = value.data || {};
            value.code = value.code || 200;
            return value;
        });
    }
    return data;
}

function getDefaultPreset(data) {
    return data ? {default: data} : false;
}

function getDefaultMethod(presets) {
    return presets ? {GET: presets} : false;
}

function getNormalizeUrl(url) {
    return url;
}

function getAvailablePresets(data) {
    if (data.data || data.code) {
        return [];
    }
    return _.keys(data);
}

function getAvailableMethods(data) {
    var methods = getMethods(data);
    var available = _.intersection(methods, _.keys(data));
    var incorrect = _.xor(_.keys(data), available);
    if (available.length && incorrect.length) {
        console.error('Improperly configured methods: ', incorrect);
    }
    return available;
}

function getMethods() {
    return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
}
