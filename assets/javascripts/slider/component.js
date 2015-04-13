define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        slider: null,
        didInsertElement: function() {
            var element = this.$().slider({
                tooltip: 'hide'
            });

            element.on('slide', function(event) {
                this.set('slider.value', event.value);
            }.bind(this));

            element.on('slideStart', function() {
                this.set('slider.isDragged', true);
            }.bind(this));

            element.on('slideStop', function(event) {
                this.get('slider').onSlideStop(event.value);

                this.set('slider.isDragged', false);
            }.bind(this));

            this.set('slider.element', element);
        },
        willDestroyElement: function() {
            this.$().slider('destroy');
        }
    });
});
