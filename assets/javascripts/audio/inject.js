define(function(require) {
    'use strict';

    var audio = require('audio/object');

    return function(Application) {
        Application.initializer({
            name: 'audio',
            initialize: function(container, application) {
                application.register('audio:main', audio);

                application.inject('route', 'audio', 'audio:main');
                application.inject('controller', 'audio', 'audio:main');
            }
        });
    };
});
