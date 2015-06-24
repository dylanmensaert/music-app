define(function(require) {
    'use strict';

    var cache = require('cache/object');

    return function(Application) {
        Application.initializer({
            name: 'cache',
            initialize: function(container, application) {
                application.register('cache:main', cache);

                application.inject('route', 'cache', 'cache:main');
                application.inject('controller', 'cache', 'cache:main');
            }
        });
    };
});
