define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        // TODO: nested folders is not supported in template compiler?
        layoutName: 'snippetActionBar',
        snippets: null,
        isEverySaved: function() {
            return this.get('snippets').isEvery('isSaved');
        }.property('snippets.@each.isSaved'),
        isEveryUnsaved: function() {
            return this.get('snippets').isEvery('isSaved', false);
        }.property('snippets.@each.isSaved'),
        savedSnippets: function() {
            return this.get('snippets').filterBy('isSaved');
        }.property('snippets.@each.isSaved'),
        unsavedSnippets: function() {
            return this.get('snippets').filterBy('isSaved', false);
        }.property('snippets.@each.isSaved'),
        hasSingle: function() {
            return this.get('snippets.length') === 1;
        }.property('snippets.length'),
        actions: {
            remove: function() {
                this.sendAction('remove');
            },
            setupEdit: function() {
                this.sendAction('setupEdit');
            },
            saveEdit: function() {
                this.sendAction('saveEdit');
            },
            exitEdit: function() {
                this.sendAction('exitEdit');
            }
        }
    });
});
