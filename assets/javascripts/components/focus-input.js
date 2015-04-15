define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.TextField.extend({
        becomeFocused: function() {
            this.$().focus();
        }.on('didInsertElement')
    });
});
