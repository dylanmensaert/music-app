define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        actions: {
            updateTitle: function(tokens) {
                tokens.push(this.get('title'));
                return true;
            }
        }
    });
});
