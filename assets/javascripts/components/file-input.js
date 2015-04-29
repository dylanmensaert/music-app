define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.TextField.extend({
        attributeBindings: ['type', 'multiple', 'accept', 'title'],
        title: ' ',
        type: 'file',
        multiple: 'multiple',
        accept: 'audio/*,video/*',
        didInsertElement: function() {
            var fileSystem = this.get('session.model.fileSystem'),
                files;

            this.$().onchange = function() {
                files = this.files;

                fileSystem.root.getDirectory('music/local', function(directoryEntry) {
                    files.forEach(function(file) {
                        directoryEntry.getFile(file.name, {
                            create: true,
                            exclusive: true
                        }, function(fileEntry) {
                            fileEntry.createWriter(function(fileWriter) {
                                fileWriter.write(file);
                            });
                        });
                    });
                });
            };
        }
    });
});
