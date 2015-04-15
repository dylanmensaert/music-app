define(function(require) {
    'use strict';

    var Ember = require('ember'),
        errors = Ember.Map.create();

    errors.set(1, 'Fetching process aborted by user');
    errors.set(2, 'Error occurred when downloading');
    errors.set(3, 'Error occurred when decoding');
    errors.set(4, 'Audio not supported');

    return Ember.Component.extend({
        tagName: 'audio',
        audio: null,
        didInsertElement: function() {
            var element = this.get('element'),
                audio = this.get('audio');

            element.addEventListener('durationchange', function(event) {
                audio.set('duration', event.target.duration);
            });

            element.addEventListener('timeupdate', function(event) {
                audio.set('currentTime', event.target.currentTime);
            });

            element.addEventListener('abort', function(event) {
                var code = event.target.error.code;

                audio.set('error', Ember.Object.create({
                    type: event.type,
                    code: code,
                    message: errors.get(code)
                }));
            });

            element.addEventListener('error', function(event) {
                var code = event.target.error.code;

                audio.set('error', Ember.Object.create({
                    type: event.type,
                    code: code,
                    message: errors.get(code)
                }));
            });

            element.addEventListener('stalled', function() {
                audio.setLoading(true);
            });

            element.addEventListener('loadstart', function() {
                audio.setLoading(true);
            });

            element.addEventListener('canplay', function() {
                audio.setLoading(false);
            });

            element.addEventListener('waiting', function() {
                audio.setLoading(true);
            });

            element.addEventListener('pause', function() {
                audio.setPlaying(false);
            });

            element.addEventListener('playing', function() {
                audio.setPlaying(true);
            });

            element.addEventListener('ended', function() {
                audio.set('hasEnded', true);
            });

            // TODO: Implement events: seekable, played.

            audio.set('element', element);
        },
        willDestroyElement: function() {
            var element = this.get('element');

            element.removeEventListener('canplay');
            element.removeEventListener('durationchange');
            element.removeEventListener('timeupdate');
            element.removeEventListener('ended');

            this.set('audio.element', null);
        }
    });
});
