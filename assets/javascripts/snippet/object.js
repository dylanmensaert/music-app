/* global location: true, escape: true, XMLHttpRequest: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        extractExtension,
        meta = require('meta-data'),
        ytMp3 = require('helpers/yt-mp3'),
        signateUrl;

    signateUrl = function(url) {
        var host = 'http://www.youtube-mp3.org';

        return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
    };

    extractExtension = function(source) {
        return source.substr(source.lastIndexOf('.') + 1, source.length);
    };

    return Ember.Object.extend({
        init: function() {
            this._super();

            this.setLocal('audio', this.get('extension'));
        },
        id: null,
        title: null,
        extension: null,
        labels: [],
        isLocal: function() {
            return this.get('labels').contains('local');
        }.property('labels.@each'),
        audio: null,
        thumbnail: null,
        setLocal: function(type, extension) {
            var directory = Ember.Inflector.inflector.pluralize(type),
                source;

            source = 'filesystem:http://' + location.hostname + '/' + directory + '/' + this.get('id') + '.' + extension;

            this.set(type, source);
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
        save: function(source) {
            var oldThumbnail = this.get('thumbnail');

            this.get('labels').pushObject('local');
            this.get('session.model').pushSnippets([this]);

            this.download('audio', source);

            this.setLocal('thumbnail', extractExtension(oldThumbnail));
            this.download('thumbnail', oldThumbnail);
        },
        download: function(type, url) {
            var fileSystem = this.get('session.model.fileSystem'),
                source = this.get(type),
                xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function() {
                fileSystem.root.getFile(source, {
                    create: true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.write(this.response);
                    });
                });
            };

            xhr.send();
        }
    });
});
