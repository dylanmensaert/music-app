define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'Index',
        redirect: function() {
            this.transitionTo('explorer.index');
        }
    });
});
