define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data'),
        extractSuffix;

    extractSuffix = function(url) {
        var index = url.indexOf('/download');

        return url.substring(index);
    };

    return Ember.Object.extend({
        element: null,
        snippet: null,
        currentTime: null,
        duration: null,
        buffered: null,
        error: null,
        hasEnded: false,
        isLoading: false,
        isPlaying: false,
        setError: function(error) {
            this.set('error', error);

            this.set('isLoading', false);
            this.set('isPlaying', false);
        },
        setLoading: function(isLoading) {
            this.set('isLoading', isLoading);

            this.set('error', null);
            this.set('isPlaying', false);
        },
        setPlaying: function(isPlaying) {
            this.set('isPlaying', isPlaying);

            this.set('error', null);
            this.set('isLoading', false);
        },
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
            var element = this.get('element'),
                videoUrl = 'https://www.youtube.com/watch?v=' + snippet.videoId,
                url = metaData.downloadHost + '/fetch/?api=advanced&format=JSON&video=' + videoUrl;

            this.set('snippet', snippet);

            Ember.$.getJSON(url).then(function(response) {
                element.src = metaData.downloadHost + extractSuffix(response.link);
                element.load();

                this.play();
            }.bind(this));
        }
    });
});
