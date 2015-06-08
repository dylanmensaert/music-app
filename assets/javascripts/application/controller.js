define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'audio-component': require('audio/component'),
        'slider-component': require('slider/component'),
        slider: null,
        isLoading: false,
        // TODO: snippets not being updated since part of new array defined in index controller..
        snippets: function() {
            return this.get('fileSystem.snippets').filterBy('isSelected', true);
        }.property('fileSystem.snippets.@each.isSelected'),
        // TODO: Unified name for local vs unsaved..
        isAnySaved: function() {
            return this.get('snippets').isAny('isSaved', true);
        }.property('snippets.@each.isSaved'),
        isAnyUnsaved: function() {
            return this.get('snippets').isAny('isSaved', false);
        }.property('snippets.@each.isSaved'),
        actions: {
            dismissAlert: function() {
                this.set('error', null);
            },
            play: function() {
                this.get('audio').play();
            },
            pause: function() {
                this.get('audio').pause();
            },
            save: function() {
                this.get('snippets').forEach(function(snippet) {
                    if (!snippet.get('isSaved')) {
                        snippet.fetchDownload().then(function() {
                            snippet.save();
                        });
                    }
                });
            },
            remove: function() {
                this.get('snippets').forEach(function(snippet) {
                    if (snippet.get('isSaved')) {
                        this.get('fileSystem').remove(snippet);
                    }
                });
            },
            deselect: function() {
                this.get('snippets').setEach('isSelected', false);
            }
        }
    });
});
