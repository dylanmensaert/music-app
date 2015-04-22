define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data'),
        ytMp3 = require('helpers/yt-mp3'),
        signateUrl;

    signateUrl = function(url) {
        var host = 'http://www.youtube-mp3.org';

        return metaData.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
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
            var element = this.get('element'),
                videoUrl = 'http://www.youtube.com/watch?v=' + snippet.videoId,
                url;

            this.set('snippet', snippet);

            url = '/a/pushItem/?';
            url += 'item=' + escape(videoUrl);
            url += '&el=na&bf=false';
            url += '&r=' + (new Date).getTime();

            Ember.$.ajax(signateUrl(url)).then(function(videoId) {
                url = '/a/itemInfo/?';
                url += 'video_id=' + videoId;
                url += '&ac=www&t=grp';
                url += '&r=' + (new Date).getTime();

                Ember.$.ajax(signateUrl(url)).then(function(info) {
                    info = info.substring(7, info.length - 1);
                    info = JSON.parse(info);

                    url = '/get?';
                    url += 'video_id=' + videoId;
                    url += '&ts_create=' + info.ts_create;
                    url += '&r=' + info.r;
                    url += '&h2=' + info.h2;

                    element.src = signateUrl(url);
                    element.load();

                    this.play();
                }.bind(this));
            }.bind(this));
        }
    });
});
