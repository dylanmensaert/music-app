define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet/action_bar',
        snippets: null,
        isEditMode: null,
        isEverySaved: function() {
            return this.get('snippets').isEvery('isSaved');
        }.property('snippets.@each.isSaved'),
        isEveryUnsaved: function() {
            return this.get('snippets').isEvery('isSaved', false);
        }.property('snippets.@each.isSaved'),
        offlineSnippets: function() {
            return this.get('snippets').filterBy('isOffline');
        }.property('snippets.@each.isOffline'),
        unsavedSnippets: function() {
            return this.get('snippets').filterBy('isSaved', false);
        }.property('snippets.@each.isSaved'),
        hasSingle: function() {
            return this.get('snippets.length') === 1;
        }.property('snippets.length'),
        actions: {
            save: function() {
                this.sendAction('save');
            },
            remove: function() {
                this.sendAction('remove');
            },
            setupEdit: function() {
                this.sendAction('setupEdit');
            },
            exitEdit: function() {
                this.sendAction('exitEdit');
            }
        }
    });
});
