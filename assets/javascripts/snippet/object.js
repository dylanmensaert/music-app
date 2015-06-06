/* global location: true, escape: true, XMLHttpRequest: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        ytMp3 = require('helpers/yt-mp3'),
        signateUrl,
        extractExtension,
        getLocal;

    signateUrl = function(url) {
        var host = 'http://www.youtube-mp3.org';

        return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
    };

    extractExtension = function(source) {
        return source.substr(source.lastIndexOf('.') + 1, source.length);
    };

    getLocal = function(type, fileName) {
        var directory = Ember.Inflector.inflector.pluralize(type);

        return 'filesystem:http://' + location.hostname + '/' + directory + '/' + fileName;
    };

    return Ember.Object.extend({
        id: null,
        title: null,
        extension: null,
        labels: [],
        thumbnail: null,
        fileSystem: null,
        isLocal: function() {
            return this.get('labels').contains('local');
        }.property('labels.@each'),
        audio: function() {
            return this.getLocal('audio', this.get('extension'));
        }.property('extension'),
        getLocal: function(type, extension) {
            var fileName = this.get('id') + '.' + extension,
                directory = Ember.Inflector.inflector.pluralize(type);

            return 'filesystem:http://' + location.hostname + '/' + directory + '/' + fileName;
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

                    return signateUrl(url);
                });
            });
        },
        save: function(url) {
            var oldThumbnail = this.get('thumbnail');

            this.download('audio', url);

            // TODO: write to filesystem on snippet property change
            // TODO: Implement download via promise, then set local path on success..
            this.download('thumbnail', oldThumbnail);
            this.set('thumbnail', getLocal('thumbnail', extractExtension(oldThumbnail)));

            // TODO: update local labels and snippets in 1 write action
            this.get('labels').pushObject('local');
            this.get('fileSystem.snippets').pushObject(this);
        },
        download: function(type, url) {
            var fileSystem = this.get('fileSystem'),
                source = this.get(type),
                xhr = new XMLHttpRequest(),
                response;

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function() {
                response = this.response;

                fileSystem.get('instance').root.getFile(source, {
                    create: true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.write(response);
                    });
                });
            };

            xhr.send();
        },
        toJSON: function() {
            return JSON.stringify(this.getProperties('id', 'title', 'extension', 'labels', 'thumbnail'));
        }
    });
});
