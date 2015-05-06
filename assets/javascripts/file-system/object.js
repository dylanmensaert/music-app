/* global window: true, Blob: true, FileReader: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        read,
        write,
        Data;

    read = function(fileEntry) {
        var reader;

        return new Ember.RSVP.Promise(function(resolve) {
            fileEntry.file(function(file) {
                reader = new FileReader();

                reader.onloadend = function() {
                    resolve(JSON.parse(this.result));
                };

                reader.readAsText(file);
            });
        });
    };

    write = function(fileEntry, snippets, modify) {
        fileEntry.createWriter(function(fileWriter) {
            modify();
            data.snippets.pushObjects(snippets);

            fileWriter.onwriteend = function() {
                if (!fileWriter.length) {
                    fileWriter.write(new Blob(JSON.stringify(data), {
                        type: 'application/json'
                    }));
                }
            };

            fileWriter.truncate(0);
        });
    };

    Data = Ember.Object.extend({
        snippets: null,
        contains: function(property, value) {
            this.get('snippets').any(function(snippet) {
                return snippet.get(property) === value;
            });
        }
    });

    return Ember.Object.extend({
        init: function() {
            this._super();

            window.webkitRequestFileSystem(window.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile('data.json', {
                    create: true,
                    exclusive: true
                });

                fileSystem.root.getDirectory('thumbnails', {
                    create: true,
                    exclusive: true
                });

                fileSystem.root.getDirectory('audio', {
                    create: true,
                    exclusive: true
                });

                this.set('instance', fileSystem);
            }.bind(this));
        },
        instance: null,
        fetchData: function() {
            return new Ember.RSVP.Promise(function(resolve) {
                this.get('instance').root.getFile('data.json', function(fileEntry) {
                    read(fileEntry).then(function(data) {
                        resolve(Data.create(data));
                    });
                });
            }.bind(this));
        },
        pushSnippet: function(snippet) {
            this.pushSnippets([snippet]);
        },
        pushSnippets: function(snippets) {
            this.get('instance').root.getFile('data.json', {
                create: true,
                exclusive: true
            }, function(fileEntry) {
                write(fileEntry, {
                    snippets: snippets
                });
            }, function(fileEntry) {
                // TODO: Check if this returns fileEntry as parameter and not error

                read(fileEntry).then(function(data) {
                    data.snippets.pushObjects(snippets);

                    write(fileEntry, data);
                });
            });
        },
        removeSnippet: function(snippet) {
            this.get('instance').root.getFile('data.json', function(fileEntry) {
                read(fileEntry).then(function(data) {
                    // Check if this removes the correct object
                    data.snippets.removeObject(snippet);

                    write(fileEntry, data);
                });
            });
        }
    });
});
