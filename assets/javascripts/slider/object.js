define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        element: null,
        value: null,
        max: null,
        isDragged: false,
        onSlideStop: null,
        setValue: function(value) {
            if (!this.get('isDragged')) {
                this.get('element').slider('setValue', value, true);
            }
        },
        updateMax: function() {
            this.get('element').slider('setAttribute', 'max', this.get('max'));
        }.observes('max')
    });
});
