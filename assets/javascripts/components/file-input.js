define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Snippet = require('helpers/snippet'),
        write;

    write = function(fileEntry, snippets, meta) {
        fileEntry.createWriter(function(fileWriter) {
            meta.get('snippets').pushObjects(snippets);

            fileWriter.write(new Blob(JSON.stringify(meta), {
                type: 'application/json'
            }));
        });
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
                snippets;

            this.$().onchange = function() {
                files = this.files;

                files.forEach(function(file) {
                    fileSystem.root.getFile(file.name, {
                        create: true,
                        exclusive: true
                    }, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                            fileWriter.write(file);
                        });
                    });
                });

                snippets = files.map(function(file) {
                    return Snippet.create({
                        id: file.name,
                        title: file.name,
                        labels: ['local']
                    });
                });

                fileSystem.root.getFile('meta.json', {
                    create: true,
                    exclusive: true
                }, function(fileEntry) {
                    write(fileEntry, snippets, Ember.Object.create({}));
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
            };
        }
    });
});
