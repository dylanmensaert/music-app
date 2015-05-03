define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Snippet = require('helpers/snippet'),
        write,
        split;

    write = function(fileEntry, snippets, data) {
        fileEntry.createWriter(function(fileWriter) {
            data.get('snippets').pushObjects(snippets);

            fileWriter.write(new Blob(JSON.stringify(data), {
                type: 'application/json'
            }));
        });
    };

    split = function(fileName) {
        var lastIndex = fileName.lastIndexOf('.');

        return {
            title: fileName.substr(0, lastIndex),
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
                fileName;

            this.$().onchange = function() {
                files = this.files;

                snippets = files.map(function(file) {
                    fileName = split(file.name);

                    return Snippet.create({
                        id: fileName.title,
                        title: fileName.title,
                        audio: {
                            extension: fileName.extension
                        },
                        labels: ['local']
                    });
                });

                fileSystem.root.getFile('data.json', {
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
