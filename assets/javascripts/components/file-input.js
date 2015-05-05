define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Snippet = require('snippet/object'),
        writer = require('snippet/writer'),
        split;

    split = function(fileName) {
        var lastIndex = fileName.lastIndexOf('.');

        return {
            title: fileName.substr(0, lastIndex),
            extension: fileName.substr(lastIndex + 1, fileName.length)
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
                snippets,
                fileName;

            this.$().onchange = function() {
                snippets = this.files.map(function(file) {
                    fileName = split(file.name);

                    return Snippet.create({
                        init: function() {
                            this._super(fileName.extension);
                        },
                        id: fileName.title,
                        title: fileName.title,
                        labels: ['local']
                    });
                });

                writer.pushSnippets(snippets);

                this.files.forEach(function(file) {
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
