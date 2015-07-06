/* global window: true, Blob: true, FileReader: true, PERSISTENT: true, Number: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Label = require('label/object'),
        Snippet = require('snippet/object'),
        write,
        lastWriter;

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    write = function() {
        var json = this.toJSON();

        this.get('instance').root.getFile('data.json', {}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function() {
                    if (!fileWriter.length) {
                        fileWriter.write(new Blob([json], {
                            type: 'application/json'
                        }));
                    }
                };

                fileWriter.truncate(0);
            });
        });
    };

    return Ember.Object.extend({
        init: function() {
            this._super();

            this.forge();
        },
        instance: null,
        labels: [],
        snippets: [],
        queue: [],
        history: [],
        playingSnippetId: null,
        // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
        forge: function() {
            navigator.webkitPersistentStorage.queryUsageAndQuota(function(usage, quota) {
                if (quota > usage) {
                    this.create(quota).then(this.createFiles.bind(this));
                } else {
                    this.increaseQuota().then(this.createFiles.bind(this));
                }
            }.bind(this));
        },
        increaseQuota: function() {
            return new Ember.RSVP.Promise(function(resolve) {
                navigator.webkitPersistentStorage.requestQuota(Number.MAX_SAFE_INTEGER, function(bytes) {
                    this.create(bytes).then(resolve);
                }.bind(this));
            }.bind(this));
        },
        create: function(bytes) {
            return new Ember.RSVP.Promise(function(resolve) {
                requestFileSystem(PERSISTENT, bytes, function(fileSystem) {
                    this.set('instance', fileSystem);

                    resolve(fileSystem);
                }.bind(this));
            }.bind(this));
        },
        write: function() {
            Ember.run.cancel(lastWriter);

            lastWriter = Ember.run.later(this, write, 100);
            /*TODO: snippets.@each.labels.@each needed?*/
        }.observes('playingSnippetId', 'queue.@each', 'history.@each', 'labels.@each', 'snippets.@each',
            'snippets.@each.labels.@each'),
        remove: function(source) {
            return new Ember.RSVP.Promise(function(resolve) {
                this.get('instance').root.getFile(source, {}, function(fileEntry) {
                    fileEntry.remove(function() {
                        resolve();
                    });
                });
            }.bind(this));
        },
        createFiles: function(instance) {
            var fileSystem = this,
                reader,
                parseJSON = this.parseJSON.bind(this);

            instance.root.getFile('data.json', {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    reader = new FileReader();

                    reader.onloadend = function() {
                        parseJSON(this.result);
                    };

                    reader.readAsText(file);
                });
            }, function() {
                instance.root.getFile('data.json', {
                    create: true
                }, function() {
                    this.get('labels').pushObject(Label.create({
                        name: 'downloaded',
                        permission: 'hidden'
                    }));

                    this.get('labels').pushObject(Label.create({
                        name: 'download-later',
                        permission: 'read-only'
                    }));
                }.bind(this));
            }.bind(this));

            instance.root.getDirectory('thumbnails', {
                create: true
            });

            instance.root.getDirectory('audio', {
                create: true
            });
        },
        parseJSON: function(json) {
            var parsedJSON = JSON.parse(json);

            parsedJSON.labels = parsedJSON.labels.map(function(label) {
                return Label.create(label);
            });

            parsedJSON.snippets = parsedJSON.snippets.map(function(snippet) {
                snippet.fileSystem = this;

                return Snippet.create(snippet);
            }.bind(this));

            this.setProperties(parsedJSON);
        },
        toJSON: function() {
            var data = {
                playingSnippetId: this.get('playingSnippetId'),
                queue: this.get('queue'),
                history: this.get('history')
            };

            data.labels = this.get('labels').map(function(label) {
                return label.strip();
            });

            data.snippets = this.get('snippets').map(function(snippet) {
                return snippet.strip();
            });

            return JSON.stringify(data);
        }
    });
});
