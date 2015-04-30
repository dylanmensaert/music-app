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
        start: function(source) {
            element.src = source;
            element.load();

            this.play();
        },
        load: function(snippet) {
            var snippet = this.get('snippet'),
                element = this.get('element');

            this.set('status', 'loading');
            this.set('snippet', snippet);

            if (!snippet.get('isLocal')) {
                this.download().then(function(source) {
                    this.start(source);
                }.bind(this));
            } else {
                this.start(snippet.get('source'));
            }
        },
        download: function() {
            var videoUrl = 'http://www.youtube.com/watch?v=' + this.get('snippet.id'),
                url;

            url = '/a/pushItem/?';
            url += 'item=' + escape(videoUrl);
            url += '&el=na&bf=false';
            url += '&r=' + (new Date).getTime();

            return Ember.$.ajax(signateUrl(url)).then(function(videoId) {
                url = '/a/itemInfo/?';
                url += 'video_id=' + videoId;
                url += '&ac=www&t=grp';
                url += '&r=' + (new Date).getTime();

                return Ember.$.ajax(signateUrl(url)).then(function(info) {
                    info = info.substring(7, info.length - 1);
                    info = JSON.parse(info);

                    url = '/get?';
                    url += 'video_id=' + videoId;
                    url += '&ts_create=' + info.ts_create;
                    url += '&r=' + info.r;
                    url += '&h2=' + info.h2;

                    return signateUrl(url);
                });
            });
        },
        write: function(fileEntry, snippets) {
            var snippet = this.get('snippet');

            snippet.get('labels').pushObject('local');

            fileEntry.createWriter(function(fileWriter) {
                snippets.pushObject(snippet);

                fileWriter.write(new Blob(JSON.stringify(snippets), {
                    type: 'application/json'
                }));
            });
        },
        save: function() {
            var write = this.write.bind(this),
                snippet = this.get('snippet'),
                currentSrc = this.get('element').currentSrc,
                source,
                reader;

            this.get('session.model.fileSystem').root.getDirectory('youtube', function(directoryEntry) {
                directoryEntry.getFile('meta.json', {
                    create: true,
                    exclusive: true
                }, function(fileEntry) {
                    write(fileEntry, Ember.Object.create({}));
                }, function(fileEntry) {
                    // TODO: Check if this returns fileEntry as parameter and not error

                    fileEntry.file(function(file) {
                        reader = new FileReader();

                        reader.onloadend = function() {
                            write(fileEntry, JSON.parse(this.result));
                        };

                        reader.readAsText(file);
                    });
                });

                source = 'audio/' + snippet.get('videoId') + '.mp3';

                directoryEntry.getFile(source, {
                    create: true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        // TODO: Write currentSrc to fileEntry
                    });
                });
            });
        }
    });
});
