/* global location: true, escape: true, XMLHttpRequest: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        ytMp3 = require('helpers/yt-mp3'),
        utilities = require('helpers/utilities'),
        signateUrl,
        extractExtension,
        pluralizations;

    signateUrl = function(url) {
        var host = 'http://www.youtube-mp3.org';

        return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
    };

    extractExtension = function(source) {
        return source.substr(source.lastIndexOf('.') + 1, source.length);
    };

    // TODO: Rename audio?
    pluralizations = {
        audio: 'audio',
        thumbnail: 'thumbnails'
    };

    return Ember.Object.extend({
        id: null,
        title: null,
        extension: null,
        labels: [],
        audio: null,
        thumbnail: null,
        fileSystem: null,
        isSelected: false,
        status: null,
        isLoading: function() {
            return this.get('status') === 'loading';
        }.property('status'),
        isSaved: function() {
            return this.get('labels').contains('saved');
        }.property('labels.@each'),
        isQueued: function() {
            return this.get('fileSystem.queue').contains(this.get('id'));
        }.property('fileSystem.queue.@each', 'id'),
        containsLabel: function(value) {
            return this.get('labels').any(function(label) {
                return utilities.includes(label, value);
            });
        },
        createFilePath: function(type, extension) {
            var fileName = this.get('id') + '.' + extension,
                directory = pluralizations[type];

            return directory + '/' + fileName;
        },
        fetchDownload: function() {
            var videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
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

                    this.set('audio', signateUrl(url));

                    return this.get('audio');
                }.bind(this));
            }.bind(this));
        },
        save: function() {
            this.set('status', 'loading');

            if (Ember.isEmpty(this.get('audio'))) {
                this.fetchDownload().then(function(url) {
                    this.insert();
                }.bind(this));
            } else {
                this.insert();
            }
        },
        insert: function() {
            var audio = this.createFilePath('audio', this.get('extension')),
                thumbnail = this.createFilePath('thumbnail', extractExtension(this.get('thumbnail'))),
                promises;

            promises = {
                // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
                audio: this.download(this.get('audio'), audio),
                // TODO: write to filesystem on snippet property change
                thumbnail: this.download(this.get('thumbnail'), thumbnail)
            };

            Ember.RSVP.hash(promises).then(function(hash) {
                this.set('audio', hash.audio);
                this.set('thumbnail', hash.thumbnail);

                this.get('labels').pushObject('saved');

                // TODO: update offline labels and snippets in 1 write action
                // TODO: only perform this
                this.get('fileSystem.snippets').pushObject(this);

                this.set('status', null);
            }.bind(this));
            // TODO: Implement every error by showing a message for few seconds
        },
        download: function(url, source) {
            var fileSystem = this.get('fileSystem'),
                xhr = new XMLHttpRequest(),
                response;

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            return new Ember.RSVP.Promise(function(resolve) {
                xhr.onload = function() {
                    response = this.response;

                    fileSystem.get('instance').root.getFile(source, {
                        create: true
                    }, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                            fileWriter.onwriteend = function() {
                                resolve(fileEntry.toURL());
                            };

                            fileWriter.write(new Blob([response]));
                        });
                    });
                };

                xhr.send();
            });
        },
        remove: function() {
            var fileSystem = this.get('fileSystem'),
                promises;

            promises = {
                audio: fileSystem.remove(this.get('audio')),
                thumbnail: fileSystem.remove(this.get('thumbnail'))
            };

            Ember.RSVP.all(promises).then(function() {
                fileSystem.get('snippets').removeObject(this);
            }.bind(this));
        },
        strip: function() {
            return this.getProperties('id', 'title', 'extension', 'labels', 'thumbnail');
        }
    });
});
