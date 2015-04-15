define(function(require) {
    'use strict';

    var Ember = require('ember');

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
                console.log('abort')
                audio.set('error', Ember.Object.create({
                    type: event.type,
                    message: 'The media data download has been aborted.'
                }));
            });

            element.addEventListener('error', function(event) {
                console.log('error')
                    // TODO: implement event.target.error?
                audio.set('error', Ember.Object.create({
                    type: event.type,
                    message: 'An error occurred while loading the media data.'
                }));
            });

            element.addEventListener('stalled', function() {
                console.log('stalled')
                audio.set('isLoading', true);
            });

            element.addEventListener('loadstart', function() {
                console.log('loadstart')
                audio.set('isLoading', true);
            });

            element.addEventListener('canplay', function() {
                console.log('canplay')
                audio.set('isLoading', false);
            });

            element.addEventListener('waiting', function() {
                console.log('waiting')
                audio.set('isLoading', true);
            });

            element.addEventListener('pause', function() {
                console.log('pause')
                audio.set('isPlaying', false);
            });

            element.addEventListener('playing', function() {
                console.log('playing')
                audio.set('isPlaying', true);
            });

            element.addEventListener('ended', function() {
                console.log('ended')
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
