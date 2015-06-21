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
                this.get('element').val(value);
            }
        },
        updateMax: function() {
            this.get('element').noUiSlider({
                range: {
                    'min': 0,
                    'max': this.get('max')
                }
            }, true);
        }.observes('max')
    });
});
