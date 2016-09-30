RestEmulator
===========

# Installation

    npm install --save rest-emulator

# Links

* [Gulp plugin](https://github.com/temrdm/gulp-rest-emulator)
* [Standalone node server](https://github.com/Pouja/node-rest-emulator)

# Usage

## Express

    var express = require('express');
    var restEmulator = require('rest-emulator');

    var config = {
        '/api/users': {
            data: [
                {name: 'Name1'},
                {name: 'Name2'}
            ]
        }
    };

    var app = express();
    var restInstance = restEmulator(config);

    app.use(restInstance.middleware);

    app.listen(3000);

# Mock

## Example structure

  	mocks/
  	    default.js
  	    users/
  	        default.js
  	        custom.js
	    cities/
	       default.js
           custom.js
        country.js

## Mock syntax

### Basic

```
module.exports = {
    '/api/users': {
        data: [
            { name: 'John' },
            { name: 'Adam' }
        ],
        headers: {
            ETag: '12345'
        }
    },
    '/api/cities': {
        data: [
            { name: 'New York' },
            { name: 'Miami' }
        ],
        query: {
            'name=Miami': {
                data: [
                    { name: 'Miami' }
                ]
            },
            'name=New York': {
                data: [
                    { name: 'New York' }
                ]
            }
        },
        code: 200,
        timeout: 5000
    }
};
```

### Default

```
module.exports = {
    '/api/users': {
        GET: {
            data: [
                { name: 'John' },
                { name: 'Adam' }
            ],
            headers: {
                ETag: '12345'
            }
            query: {
                'name=John': {
                    data: [
                        { name: 'John' }
                    ]
                }
            }
        },
        POST: {
            data: {
                success: true
            },
            code: 201,
            timeout: 1000
        }
    }
};
```

### Full (with presets)

```
module.exports = {
    '/api/users': {
        GET: {
            default: {
                data: [
                    { name: 'John' },
                    { name: 'Adam' }
                ],
                code: 200,
                timeout: 0
            },
            blank: {
                data: [],
                code: 200,
                timeout: 0,
                headers: {
                    ETag: '12345'
                }
            },
            increase: {
                data: [
                    { name: 'John' },
                    { name: 'Adam' },
                    { name: 'Clark' },
                    { name: 'Earl' }
                ],
                code: 200,
                timeout: 0
            }
        },
        POST: {
            default: {
                data: {
                    success: true
                },
                code: 201
            },
            error: {
                code: 405
            }
        }
    },
    '/api/cities': {
        'GET': {
            data: [
                { name: 'New York' },
                { name: 'Miami' }
            ],
             query: {
                 'name=Miami': {
                     data: [
                         { name: 'Miami' }
                     ]
                 },
                 'name=New York': {
                     data: [
                         { name: 'New York' }
                     ]
                 }
             }
        }
    }
};
```
