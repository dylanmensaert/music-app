define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'audio-component': require('audio/component'),
        'slider-component': require('slider/component'),
        isLoading: false,
        actions: {
            dismissAlert: function() {
                this.set('error', null);
            }
        }
    });
});
