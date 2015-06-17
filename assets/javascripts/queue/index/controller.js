define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        // TODO: sort
        /*queue = this.get('fileSystem.queue');

        if (queue.indexOf(snippet.get('id')) > queue.indexOf(other.get('id'))) {
            result = 1;
        }*/

        /*load: function(snippet) {
                this.get('audio').load(snippet);
            },*/

        /*didUpdate: function(snippetIds) {
                    var firstSnippetId = snippetIds.get('firstObject'),
                        hasChangedFirst = this.get('fileSystem.queue.firstObject') !== firstSnippetId,
                        firstSnippet;

                    this.set('fileSystem.queue', snippetIds);

                    this.get('selectedSnippets').forEach(function(snippet) {
                        if (!snippet.get('isSaved')) {
                            snippet.save();
                        }

                        if (hasChangedFirst && snippet.get('id') === firstSnippetId) {
                            firstSnippet = snippet;
                        }
                    });

                    if (hasChangedFirst && Ember.isEmpty(firstSnippet)) {
                        firstSnippet = this.get('fileSystem.snippets').findBy('id', firstSnippetId);
                    }

                    if (!Ember.isEmpty(firstSnippet)) {
                        this.get('audio').play(firstSnippet);
                    }
                },*/
    });
});
