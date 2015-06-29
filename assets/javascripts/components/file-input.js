define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Snippet = require('snippet/object'),
        split;

    split = function(fileName) {
        var lastIndex = fileName.lastIndexOf('.');

        return {
            value: fileName.substr(0, lastIndex),
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
            var fileSystem = this.get('fileSystem'),
                snippets,
                fileName;

            this.$().onchange = function() {
                snippets = this.files.map(function(file) {
                    fileName = split(file.name);

                    return Snippet.create({
                        id: fileName.value,
                        name: fileName.value,
                        extension: fileName.extension,
                        labels: ['downloaded']
                    });
                });

                fileSystem.pushObjects(snippets);

                this.files.forEach(function(file) {
                    fileSystem.get('instance').root.getFile(file.name, {
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
