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
        didEnd: null,
        startPlay: false,
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
        play: function(snippet) {
            var element = this.get('element');

            if (Ember.isEmpty(snippet)) {
                element.play();
            } else {
                this.set('startPlay', true);

                this.load(snippet);
            }
        },
        pause: function() {
            this.get('element').pause();
        },
        load: function(snippet) {
            var audio = snippet.get('audio');

            this.set('status', 'loading');
            this.set('snippet', snippet);

            if (Ember.isEmpty(audio)) {
                snippet.fetchDownload().then(function(url) {
                    this.loadSource(url);
                }.bind(this));
            } else {
                this.loadSource(audio);
            }
        },
        loadSource: function(source) {
            var element = this.get('element');

            element.src = source;

            element.load();
        }
    });
});
