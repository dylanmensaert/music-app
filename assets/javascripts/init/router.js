define(function(require) {
    'use strict';

    var App = require('init/app');

    App.Router.reopen({
        updateTitle: function() {
            this.send('updateTitle', []);
        }.on('didTransition')
    });

    App.Router.map(function() {
        this.resource('explorer', function() {
            this.resource('labels');
        });

        this.resource('queue', function() {

        });
    });
});
