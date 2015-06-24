define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'actionBar',
        classNames: ['action-bar', 'btn-primary', 'container', 'text-center'],
        models: null,
        numberOfCells: function() {
            var numberOfCells = 3;

            if (this.get('unsavedModel')) {
                numberOfCells += 1;
            }

            if (this.get('hasSingle')) {
                numberOfCells += 1;
            }

            if (this.get('savedModel')) {
                numberOfCells += 1;
            }

            return numberOfCells;
        }.property('unsavedModel', 'hasSingle', 'savedModel'),
        cellClass: function() {
            return 'col-xs-' + Math.floor(12 / this.get('numberOfCells'));
        }.property('numberOfCells'),
        lastCellClass: function() {
            var numberOfCells = this.get('numberOfCells');

            return 'text-right col-xs-' + (12 - (numberOfCells - 1) * Math.floor(12 / numberOfCells));
        }.property('numberOfCells'),
        isEverySaved: function() {
            return this.get('models').isEvery('isSaved');
        }.property('models.@each.isSaved'),
        isEveryUnsaved: function() {
            return this.get('models').isEvery('isSaved', false);
        }.property('models.@each.isSaved'),
        savedModels: function() {
            return this.get('models').filterBy('isSaved');
        }.property('models.@each.isSaved'),
        unsavedModels: function() {
            return this.get('models').filterBy('isSaved', false);
        }.property('models.@each.isSaved'),
        hasSingle: function() {
            return this.get('models.length') === 1;
        }.property('models.length'),
        actions: {
            edit: function() {
                this.sendAction('edit');
            },
            save: function() {
                this.sendAction('save');

                /*this.get('unsavedModels').forEach(function(snippet) {
                    snippet.fetchDownload().then(function() {
                        snippet.save();
                    });
                });*/
            },
            remove: function() {
                this.sendAction('remove');

                /*this.get('savedModels').forEach(function(snippet) {
                    snippet.remove();
                });*/
            },
            deselect: function() {
                this.get('models').setEach('isSelected', false);
            }
        }
    });
});
