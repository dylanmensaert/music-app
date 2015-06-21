define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        classNames: ['slider', 'shor', 'slider-material-orange'],
        slider: null,
        didInsertElement: function() {
            var element = this.$().noUiSlider({
                    start: 0,
                    range: {
                        'min': 0,
                        'max': 0
                    },
                    connect: 'lower'
                }),
                slider;

            element.on('slide', function() {
                slider = this.get('slider');

                slider.set('value', element.val());

                if (!slider.get('isDragged')) {
                    slider.set('isDragged', true);
                }
            }.bind(this));

            element.on('set', function() {
                this.set('slider.value', element.val());
            }.bind(this));

            element.on('change', function() {
                slider = this.get('slider');

                slider.onSlideStop(element.val());

                slider.set('isDragged', false);
            }.bind(this));

            this.set('slider.element', element);
        },
        willDestroyElement: function() {
            this.$().destroy();
        }
    });
});
