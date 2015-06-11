define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        classNames: ['col-xs-2', 'handle'],
        click: function() {
            this.sendAction();
        }
    });
});
