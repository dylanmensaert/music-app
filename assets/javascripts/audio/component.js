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
                Ember.RSVP.reject(errors.get(event.target.error.code));

                audio.set('status', 'idle');
            });

            element.addEventListener('error', function(event) {
                Ember.RSVP.reject(errors.get(event.target.error.code));

                audio.set('status', 'idle');
            });

            element.addEventListener('stalled', function() {
                audio.set('status', 'loading');
            });

            element.addEventListener('loadstart', function() {
                audio.set('status', 'loading');
            });

            element.addEventListener('canplay', function() {
                audio.set('status', 'idle');
            });

            element.addEventListener('waiting', function() {
                audio.set('status', 'loading');
            });

            element.addEventListener('pause', function() {
                audio.set('status', 'idle');
            });

            element.addEventListener('playing', function() {
                audio.set('status', 'playing');
            });

            element.addEventListener('ended', function() {
                audio.set('status', 'idle');

                audio.didEnd();
            });

            element.addEventListener('canplaythrough', function() {
                if (!audio.get('snippet.isSaved')) {
                    // TODO: currentSrc references the online source. Consider using download instead of fetchDownload, save, ..
                    // audio.set('snippet.audio', element.currentSrc);
                    audio.get('snippet').save();
                }
            });

            audio.set('element', element);
        },
        willDestroyElement: function() {
            var element = this.get('element');

            element.removeEventListener('durationchange');
            element.removeEventListener('timeupdate');
            element.removeEventListener('abort');
            element.removeEventListener('error');
            element.removeEventListener('stalled');
            element.removeEventListener('loadstart');
            element.removeEventListener('canplay');
            element.removeEventListener('waiting');
            element.removeEventListener('pause');
            element.removeEventListener('playing');
            element.removeEventListener('ended');
            element.removeEventListener('canplaythrough');

            this.set('audio.element', null);
        }
    });
});
