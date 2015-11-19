var express      = require('express');
var restEmulator = require('../');
var bodyParser   = require('body-parser');
var app          = express();
var server;

app.use(bodyParser.urlencoded({ extended: false }))

var config = [{
    '/api/v1/users': {
        default: {
            data: [{
                name: 'Name1'
            }, {
                name: 'Name2'
            }],
            headers: {
                ETag: '12345'
            }
        },
        blank: {
            data: []
        },
        increase: {
            data: [{
                name: 'Name1'
            }, {
                name: 'Name2'
            }, {
                name: 'Name3'
            }, {
                name: 'Name4'
            }]
        }
    }
}, {
    '/api/v1/cities': {
        default: {
            data: [{
                name: 'City 1'
            }, {
                name: 'City 2'
            }],
            query: {
                'name=City 1': {
                    data: [{
                        name: 'City1'
                    }],
                    headers: {
                        ETag: '54321'
                    }
                },
                'name=City 2': {
                    data: [{
                        name: 'City2'
                    }]
                }
            }
        },
        blank: {
            data: []
        },
        increase: {
            data: [{
                name: 'City1'
            }, {
                name: 'City2'
            }, {
                name: 'City3'
            }, {
                name: 'City4'
            }]
        }
    }
}, {
    '/api/v1/body': {
        POST: {
            request: {
                body: {
                    foo: 'bar'
                },
                error: {
                    code: 500,
                    data: {
                        status: false,
                        message: 'Custom error message'
                    }
                }
            },
            data: {
                bar: 'foo'
            }
        }
    }
}, {
    '/api/v2/body': {
        POST: {
            request: {
                body: {
                    foo: '*'
                },
                error: {

                }
            },
            data: {
                bar: '*'
            }
        }
    }
}, {
    '/api/v2/param/:custom': {
        GET: {
            data: {
                custom: 'param'
            }
        }
    }
}];

var restInstance = restEmulator(config);
app.use(restInstance.middleware);

server = app.listen(1111, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('RestEmulator app listening at http://%s:%s', host, port)
});
