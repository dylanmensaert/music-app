define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        actions: {
            download: function() {
                this.get('cache.selectedSnippets').forEach(function(snippet) {
                    if (!snippet.get('isDownloaded') && !snippet.get('isDownloading')) {
                        snippet.download();
                    }
                });
            }
        }
    });
});
