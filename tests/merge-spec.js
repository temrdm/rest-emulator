'use strict';

var merge = require('../lib/merge');

describe('Merge module.', function () {
    var input = {};
    var source = {};
    var output = {};

    describe('Merge config.', function () {
        function compareMergeInputOutput() {
            expect(merge(input, source)).toEqual(output);
        }

        describe('One url.', function () {
            it('Merge methods.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                source = {
                    '/api/test': {
                        POST: {
                            default: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 200
                            }
                        },
                        POST: {
                            default: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                compareMergeInputOutput();
            });
            it('Merge presets.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                source = {
                    '/api/test': {
                        GET: {
                            blank: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            default: {
                                data: {},
                                code: 200
                            },
                            blank: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                compareMergeInputOutput();
            });
            it('Merge clashes presets.', function () {
                input = {
                    '/api/test': {
                        GET: {
                            info: {
                                data: {},
                                code: 200
                            }
                        },
                        POST: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                source = {
                    '/api/test': {
                        GET: {
                            info: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        },
                        POST: {
                            default: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                output = {
                    '/api/test': {
                        GET: {
                            info: {
                                data: {},
                                code: 200
                            }
                        },
                        POST: {
                            default: {
                                data: {
                                    info: 'info'
                                },
                                code: 200
                            }
                        }
                    }
                };
                compareMergeInputOutput();
            });
        });
        describe('Many urls.', function () {
            it('Merge correct and incorrect presets.', function () {
                input = {
                    '/api/test1': {
                        POST: {
                            info: {
                                data: {},
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        DELETE: {
                            info: {
                                data: {
                                    success: true
                                },
                                code: 200
                            }
                        }
                    }
                };
                source = {
                    '/api/test3': {
                        GET: {
                            blank: {
                                data: {},
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        DELETE: {
                            info: {
                                data: {
                                    success: false
                                },
                                code: 405
                            }
                        },
                        PUT: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 201
                            }
                        }
                    }
                };
                output = {
                    '/api/test1': {
                        POST: {
                            info: {
                                data: {},
                                code: 200
                            }
                        }
                    },
                    '/api/test2': {
                        DELETE: {
                            info: {
                                data: {
                                    success: true
                                },
                                code: 200
                            }
                        },
                        PUT: {
                            default: {
                                data: {
                                    success: true
                                },
                                code: 201
                            }
                        }
                    },
                    '/api/test3': {
                        GET: {
                            blank: {
                                data: {},
                                code: 200
                            }
                        }
                    }
                };
                compareMergeInputOutput();
            });
        });
    });
});