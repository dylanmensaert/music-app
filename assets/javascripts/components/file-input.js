define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Snippet = require('helpers/snippet'),
        write,
        removeExtension;

    write = function(fileEntry, snippets, meta) {
        fileEntry.createWriter(function(fileWriter) {
            meta.get('snippets').pushObjects(snippets);

            fileWriter.write(new Blob(JSON.stringify(meta), {
                type: 'application/json'
            }));
        });
    };

    createFileMeta = function(fileName) {
        var lastIndex = fileName.lastIndexOf('.');

        return {
            name: fileName.substr(0, lastIndex),
            extension: fileName.substr(lastIndex, fileName.length)
        };
    };

    return Ember.TextField.extend({
        attributeBindings: ['type', 'multiple', 'accept', 'title'],
        title: ' ',
        type: 'file',
        multiple: 'multiple',
        accept: 'audio/*,video/*',
        didInsertElement: function() {
            var fileSystem = this.get('session.model.fileSystem'),
                files,
                snippets,
                fileMeta;

            this.$().onchange = function() {
                files = this.files;

                snippets = files.map(function(file) {
                    fileMeta = createFileMeta(file.name);

                    return Snippet.create({
                        id: fileMeta.name,
                        extension: fileMeta.extension,
                        title: fileMeta.name,
                        labels: ['local']
                    });
                });

                fileSystem.root.getFile('meta.json', {
                    create: true,
                    exclusive: true
                }, function(fileEntry) {
                    write(fileEntry, snippets, Ember.Object.create({
                        snippets: []
                    }));
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

                files.forEach(function(file) {
                    fileSystem.root.getFile(file.name, {
                        create: true
                    }, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                            fileWriter.write(file);
                        });
                    });
                });
            };
        }
    });
});
