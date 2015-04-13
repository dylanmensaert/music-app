define(function() {
    'use strict';

    return function(Application) {
        Application.initializer({
            name: 'session',
            initialize: function(container, application) {
                application.register('session:main', {
                    instance: null
                }, {
                    singleton: false,
                    instantiate: false
                });

                application.inject('route', 'session', 'session:main');
                application.inject('controller', 'session', 'session:main');
            }
        });
    };
});
