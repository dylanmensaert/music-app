define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet/action_bar',
        snippets: null,
        isEditMode: null,
        isEveryOffline: function() {
            return this.get('snippets').isEvery('isOffline');
        }.property('snippets.@each.isOffline'),
        isEveryUndownloaded: function() {
            return this.get('snippets').isEvery('isDownloaded', false);
        }.property('snippets.@each.isDownloaded'),
        offlineSnippets: function() {
            return this.get('snippets').filterBy('isOffline');
        }.property('snippets.@each.isOffline'),
        undownloadedSnippets: function() {
            return this.get('snippets').filterBy('isDownloaded', false);
        }.property('snippets.@each.isDownloaded'),
        hasSingle: function() {
            return this.get('snippets.length') === 1;
        }.property('snippets.length'),
        actions: {
            download: function() {
                this.sendAction('download');
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
