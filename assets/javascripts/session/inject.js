define(function(require) {
    'use strict';

    var session = require('session/object');

    return function(Application) {
        Application.initializer({
            name: 'session',
            initialize: function(container, application) {
                application.register('session:main', session);

                application.inject('route', 'session', 'session:main');
                application.inject('controller', 'session', 'session:main');
            }
        });
    };
});
