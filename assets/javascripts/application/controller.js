define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'audio-component': require('audio/component'),
        'slider-component': require('slider/component'),
        slider: null,
        updateError: function() {
            this.set('error', this.get('audio.error'));
        }.observes('audio.error'),
        isLoading: false,
        actions: {
            dismissAlert: function() {
                this.set('error', null);
            },
            play: function() {
                this.get('audio').play();
            },
            pause: function() {
                this.get('audio').pause();
            }
        }
    });
});
