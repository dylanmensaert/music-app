/* global window: true, Blob: true, FileReader: true, PERSISTENT: true, Number: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        write,
        createFiles;

    write = function(fileSystem, json) {
        var json = this.toJSON();

        this.get('instance').root.getFile('data.json', function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function() {
                    if (!fileWriter.length) {
                        fileWriter.write(new Blob(json, {
                            type: 'application/json'
                        }));
                    }
                };

                fileWriter.truncate(0);
            });
        });
    };

    createFiles = function(instance) {
        var fileSystem = this,
            reader;

        instance.root.getFile('data.json', function(fileEntry) {
            fileEntry.file(function(file) {
                reader = new FileReader();

                reader.onloadend = function() {
                    fileSystem.setProperties(JSON.parse(this.result));
                };

                reader.readAsText(file);
            });
        }, function() {
            instance.root.getFile('data.json', {
                create: true
            });
        });

        instance.root.getDirectory('thumbnails', {
            create: true
        });

        instance.root.getDirectory('audio', {
            create: true
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
        // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
        forge: function() {
            var createFiles = createFiles.bind(this);

            this.fetchUsageAndQuota().then(function(usage, quota) {
                if (quota > usage) {
                    this.create(quota).then(createFiles);
                } else {
                    this.increaseQuota().then(createFiles);
                }
            }.bind(this));
        },
        fetchUsageAndQuota: function() {
            return Ember.RSVP.denodeify(navigator.webkitPersistentStorage.queryUsageAndQuota);
        },
        increaseQuota: function() {
            return Ember.RSVP.Promise(function(resolve) {
                navigator.webkitPersistentStorage.requestQuota(Number.MAX_SAFE_INTEGER, function(bytes) {
                    this.create(bytes).then(resolve);
                }.bind(this));
            }.bind(this));
        },
        create: function(bytes) {
            return Ember.RSVP.Promise(function(resolve) {
                webkitRequestFileSystem(PERSISTENT, bytes, function(fileSystem) {
                    this.set('instance', fileSystem);

                    resolve(fileSystem);
                }.bind(this));
            }.bind(this));
        },
        debounceWrite: function() {
            Ember.run.debounce(this, write, 100);
        }.observes('labels.@each', 'snippets.@each'),
        contains: function(property, value) {
            this.get('snippets').any(function(snippet) {
                return snippet.get(property) === value;
            });
        },
        toJSON: function() {
            var json = this.getProperties('labels');

            json.snippets = this.get('snippets').map(function(snippet) {
                return snippet.toJSON();
            });

            return JSON.stringify(json);
        }
    });
});
