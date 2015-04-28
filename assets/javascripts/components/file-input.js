define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.TextField.extend({
        attributeBindings: ['type', 'multiple'],
        type: 'file',
        multiple: 'multiple',
        didInsertElement: function() {
            this.$().onchange = function() {

            };
        }
    });
});
