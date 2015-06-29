define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        actions: {
            save: function() {
                this.get('cache.selectedSnippets').forEach(function(snippet) {
                    /*TODO: Check if wifi, else add label and this.get('fileSystem.snippets').push.. Also make compatible with browser*/
                    if (!snippet.get('isSaved')) {
                        snippet.save();
                    }
                });
            }
        }
    });
});
