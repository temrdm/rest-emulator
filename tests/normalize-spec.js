'use strict';

var normalize = require('../lib/normalize');

describe('Normalize module.', function () {
    var input = {};
    var output = {};

    describe('Helper function ', function(){

        describe('getNormalizePresets.', function(){
            it('Data without preset', function(){
                input = {
                    data: {}
                };
                output = {
                    default: {
                        data: {},
                        code: 200
                    }
                };
                expect(normalize.getNormalizePresets(input)).toEqual(output);
            });
            it('Mixin correct and incorrect preset', function(){
                input = {
                    default: {
                        data: {
                            info: 'info'
                        }
                    },
                    error: {},
                    blank: {
                        data: {}
                    }
                };
                output = {
                    default: {
                        data: {
                            info: 'info'
                        },
                        code: 200
                    },
                    blank: {
                        data: {},
                        code: 200
                    }
                };
                expect(normalize.getNormalizePresets(input)).toEqual(output);
            });
        });

    });

    describe('Normalize config.', function () {
        function compareInputNormalize() {
            expect(normalize(input)).toEqual(output);
        }

        describe('Improperly configure', function () {
            it('Blank url', function () {
                input = {
                    '/api/test': {}
                };
                output = {};
                compareInputNormalize();
            });
            it('Blank urls', function () {
                input = {
                    '/api/test1': {},
                    '/api/test2': {},
                    '/api/test3': {}
                };
                output = {};
                compareInputNormalize();
            });
            it('Blank method', function () {
                input = {
                    '/api/test': {
                        'GET': {}
                    }
                };
                output = {};
                compareInputNormalize();
            });
            it('Blank methods', function () {
                input = {
                    '/api/test': {
                        'GET': {},
                        'POST': {},
                        'PUT': {}
                    }
                };
                output = {};
                compareInputNormalize();
            });
            it('Blank preset', function () {
                input = {
                    '/api/test': {
                        'GET': {
                            default: {}
                        }
                    }
                };
                output = {};
                compareInputNormalize();
            });
            it('Blank presets', function () {
                input = {
                    '/api/test': {
                        'GET': {
                            default: {},
                            blank: {},
                            error: {}
                        }
                    }
                };
                output = {};
                compareInputNormalize();
            });
            it('Mixin mode', function () {
                input = {
                    '/api/test1': {
                        'GET': {
                            default: {},
                            error: {}
                        },
                        'POST': {
                            default: {}
                        },
                        'PUT': {}
                    },
                    '/api/test2': {
                        'GET': {
                            error: {}
                        },
                        'POST': {},
                        'DELETE': {
                            default: {}
                        }
                    }
                };
                output = {};
                compareInputNormalize();
            });
        });

        describe('One url.', function () {
            it('Config without methods, presets, data, code.', function () {
                input = {
                    '/api/test': {
                        info: 'info'
                    }
                };
                output = {};
                compareInputNormalize();
            });
            it('Config without methods, presets and data.', function () {
                input = {
                    '/api/test': {
                        code: 404
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 404
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config without methods, presets and code.', function () {
                input = {
                    '/api/test': {
                        data: {
                            info: 'info'
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config without methods and code.', function () {
                input = {
                    '/api/test': {
                        default: {
                            data: {
                                info: 'info'
                            }
                        },
                        blank: {
                            data: {}
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            },
                            blank: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config without presets and code.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            data: {
                                info: 'info'
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config without presets and data.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            code: 404
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 404
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config with all params.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config GET and POST methods without presets.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            data: {
                                info: 'info'
                            }
                        },
                        POST: {
                            data: {
                                success: true
                            },
                            code: 201
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        },
                        POST: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 201
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config GET and DELETE.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                }
                            }
                        },
                        DELETE: {
                            default: {
                                data: {
                                    success: true
                                }
                            },
                            error: {
                                data: {
                                    success: false
                                },
                                code: 401
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        },
                        DELETE: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 200
                            },
                            error: {
                                data: {
                                    success: false
                                },
                                code: 401
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config PUT and DELETE.', function () {
                input = {
                    '/api/test': {
                        PUT: {
                            data: {
                                update: true
                            },
                            code: 201
                        },
                        DELETE: {}
                    }
                };
                output = {
                    '/api/test': {
                        PUT: {
                            default: {
                                data: {
                                    update: true
                                },
                                code: 201
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
        });

        describe('Many urls.', function () {
            it('Config without methods, presets, data, code.', function () {
                input = {
                    '/api/test1': {},
                    '/api/test2': {},
                    '/api/test3': {}
                };
                output = {};
                compareInputNormalize();
            });
            it('Config without methods, presets and code.', function () {
                input = {
                    '/api/test1': {
                        data: {
                            info: 'info'
                        }
                    },
                    '/api/test2': {
                        data: {
                            info: 'info'
                        }
                    },
                    '/api/test3': {
                        data: {
                            info: 'info'
                        }
                    }
                };
                output = {
                    '/api/test1': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    },
                    '/api/test3': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Config without presets and code.', function () {
                input = {
                    '/api/test1': {
                        POST: {
                            data: {
                                info: 'info'
                            }
                        }
                    },
                    '/api/test2': {
                        PUT: {
                            data: {
                                info: 'info'
                            }
                        }
                    },
                    '/api/test3': {
                        DELETE: {
                            data: {
                                info: 'info'
                            }
                        }
                    }
                };
                output = {
                    '/api/test1': {
                        POST: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        PUT: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    },
                    '/api/test3': {
                        DELETE: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Mixed config with correct data.', function () {
                input = {
                    '/api/test1': {
                        data: {
                            info: 'info'
                        }
                    },
                    '/api/test2': {
                        code: 404
                    },
                    '/api/test3': {
                        DELETE: {
                            default: {
                                data: {
                                    success: true
                                }
                            },
                            error: {
                                code: 404
                            }
                        }
                    },
                    '/api/test4': {
                        PUT: {
                            default: {
                                data: {
                                    success: true
                                }
                            },
                            error: {
                                code: 501
                            }
                        },
                        DELETE: {},
                        POST: {
                            code: 401
                        }
                    }
                };
                output = {
                    '/api/test1': {
                        GET: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        GET: {
                            default: {
                                code: 404,
                                data: {}
                            }
                        }
                    },
                    '/api/test3': {
                        DELETE: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 200
                            },
                            error: {
                                data: {},
                                code: 404
                            }
                        }
                    },
                    '/api/test4': {
                        PUT: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 200
                            },
                            error: {
                                data: {},
                                code: 501
                            }
                        },
                        POST: {
                            default: {
                                data: {},
                                code: 401
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
            it('Mixin config with partial incorrect data', function () {
                input = {
                    '/api/test1': {
                        'GET': {
                            default: {},
                            error: {
                                data: {}
                            }
                        },
                        'POST': {
                            default: {}
                        },
                        'PUT': {}
                    },
                    '/api/test2': {
                        'GET': {
                            error: {}
                        },
                        'POST': {},
                        'DELETE': {
                            default: {}
                        }
                    },
                    '/api/test3': {
                        'GET': {
                            error: {}
                        },
                        'POST': {
                            code: 404
                        },
                        'DELETE': {
                            default: {}
                        }
                    }
                };
                output = {
                    '/api/test1': {
                        'GET': {
                            error: {
                                data: {},
                                code: 200
                            }
                        }
                    },
                    '/api/test3': {
                        'POST': {
                            default: {
                                data: {},
                                code: 404
                            }
                        }
                    }
                };
                compareInputNormalize();
            });
        });
    });
});
