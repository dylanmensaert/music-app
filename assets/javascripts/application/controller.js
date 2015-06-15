define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'audio-component': require('audio/component'),
        'slider-component': require('slider/component'),
        'action-bar': require('action-bar/component'),
        slider: null,
        isLoading: false,
        selectedSnippets: function() {
            return this.get('fileSystem.snippets').filterBy('isSelected', true);
        }.property('fileSystem.snippets.@each.isSelected'),
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
