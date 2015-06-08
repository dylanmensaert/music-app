define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        element: null,
        snippet: null,
        currentTime: null,
        duration: null,
        buffered: null,
        status: null,
        hasEnded: false,
        isLoading: function() {
            return this.get('status') === 'loading';
        }.property('status'),
        isPlaying: function() {
            return this.get('status') === 'playing';
        }.property('status'),
        isIdle: function() {
            return this.get('status') === 'idle';
        }.property('status'),
        setCurrentTime: function(currentTime) {
            this.get('element').currentTime = currentTime;
        },
        play: function() {
            this.get('element').play();
        },
        pause: function() {
            this.get('element').pause();
        },
        load: function(snippet) {
            this.set('status', 'loading');
            this.set('snippet', snippet);

            if (!snippet.get('isSaved')) {
                snippet.fetchDownload().then(function(url) {
                    this.start(url);
                }.bind(this));
            } else {
                this.start(snippet.get('audio'));
            }
        },
        start: function(source) {
            var element = this.get('element');

            element.src = source;
            element.load();

            this.play();
        }
    });
});
