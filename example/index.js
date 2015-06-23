var express = require('express');
var restEmulator = require('../');

var app = express();
var server;

var config = [
    {
        '/api/v1/users': {
            default: {
                data: [
                    {name: 'Name1'},
                    {name: 'Name2'}
                ],
                timeout: 5000,
                headers: {
                    ETag: '12345'
                }
            },
            blank: {
                data: []
            },
            increase: {
                data: [
                    {name: 'Name1'},
                    {name: 'Name2'},
                    {name: 'Name3'},
                    {name: 'Name4'}
                ]
            }
        }
    },
    {
        '/api/v1/cities': {
            default: {
                data: [
                    {name: 'City 1'},
                    {name: 'City 2'}
                ],
                query: {
                    'name=City 1': {
                        data: [
                            { name: 'City1' }
                        ],
                        headers: {
                            ETag: '54321'
                        }
                    },
                    'name=City 2': {
                        data: [
                            { name: 'City2' }
                        ]
                    }
                }
            },
            blank: {
                data: []
            },
            increase: {
                data: [
                    {name: 'City1'},
                    {name: 'City2'},
                    {name: 'City3'},
                    {name: 'City4'}
                ]
            }
        }
    }
];

var restInstance = restEmulator(config);
app.use(restInstance.middleware);

server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('RestEmulator app listening at http://%s:%s', host, port)
});
