/* global window: true, Blob: true, FileReader: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        write;

    write = function(fileEntry, snippets, data) {
        fileEntry.createWriter(function(fileWriter) {
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
        pushSnippet: function(snippet) {
            this.pushSnippets([snippet]);
        },
        pushSnippets: function(snippets) {
            var reader;

            this.get('instance').root.getFile('data.json', {
                create: true,
                exclusive: true
            }, function(fileEntry) {
                write(fileEntry, snippets, {
                    snippets: []
                });
            }, function(fileEntry) {
                // TODO: Check if this returns fileEntry as parameter and not error

                fileEntry.file(function(file) {
                    reader = new FileReader();

                    reader.onloadend = function() {
                        write(fileEntry, snippets, JSON.parse(this.result));
                    };

                    reader.readAsText(file);
                });
            });
        }
    });
});
