define(function(require) {
    'use strict';

    var Ember = require('ember'),
        compileSource,
        write;

    compileSource: function(type, fileName) {
        var directory = Ember.Inflector.inflector.pluralize(type);

        return 'filesystem:http://' + location.hostname + '/' + directory + '/' + fileName;
    };

    write = function(fileEntry, data) {
        this.setSource('thumbnail');
        this.get('labels').pushObject('local');

        return fileEntry.createWriter(function(fileWriter) {
            data.get('snippets').pushObject(this);

            fileWriter.write(new Blob(JSON.stringify(data), {
                type: 'application/json'
            }));
        }.bind(this));
    };

    return Ember.Object.extend({
        init: function() {
            this.set('audio.parent', this);
            this.set('thumbnail.parent', this);
        },
        id: null,
        title: null,
        audio: {
            extension: null,
            source: function() {
                return compileSource('audio', this.get('parent.id') + this.get('extension'));
            }.property('parent.id', 'extension')
        },
        thumbnail: {
            extension: null,
            source: null,
            setLocalSource: function() {
                var source = compileSource('audio', this.get('parent.id') + this.get('extension'));

                this.set('source', source);
            }
        },
        labels: [],
        isLocal: function() {
            return this.get('labels').contains('local');
        }.property('labels.@each'),
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
            var fileSystem = this.get('session.model.fileSystem'),
                write = write.bind(this),
                snippet = this.get('snippet'),
                reader;

            fileSystem.root.getFile('data.json', {
                create: true,
                exclusive: true
            }, function(fileEntry) {
                write(fileEntry, Ember.Object.create({
                    snippets: []
                }));
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

            this.download(source, 'audio');

            this.download(this.get('thumbnail.source'), 'thumbnail');
            this.get('thumbnail').setLocalSource();
        },
        download: function(url, type) {
            var fileSystem = this.get('session.model.fileSystem'),
                snippet = this,
                directory = Ember.Inflector.inflector.pluralize(type),
                xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function() {
                fileSystem.root.getFile(directory + '/' + snippet.get('id') + snippet.get(type + '.extension'), {
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
