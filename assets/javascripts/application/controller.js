define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'audio-component': require('audio/component'),
        'slider-component': require('slider/component'),
        slider: null,
        isLoading: false,
        linkToProperties: {
            classNames: ['btn'],
            classNameBindings: ['active:btn-primary:btn-default'],
        },
        actions: {
            dismissAlert: function() {
                this.set('error', null);
            },
            pause: function() {
                this.get('audio').pause();
            }
        }
    });
});
