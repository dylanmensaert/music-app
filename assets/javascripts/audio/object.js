define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        ytMp3 = require('helpers/yt-mp3'),
        signateUrl;

    signateUrl = function(url) {
        var host = 'http://www.youtube-mp3.org';

        return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
    };

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
            var snippet = this.get('snippet'),
                element = this.get('element');

            this.set('status', 'loading');
            this.set('snippet', snippet);

            if (!snippet.get('isLocal')) {
                snippet.fetchDownload().then(function(url) {
                    this.start(url);
                }.bind(this));
            } else {
                this.start(snippet.get('source'));
            }
        },
        start: function(source) {
            element.src = source;
            element.load();

            this.play();
        }
    });
});
