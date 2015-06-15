define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        newLabel: null,
        actions: {
            createLabel: function() {
                var newLabel = this.get('newLabel'),
                    labels = this.get('fileSystem.labels');

                if (!Ember.isEmpty(newLabel)) {
                    if (!labels.isAny('name', newLabel)) {
                        labels.pushObject(Label.create({
                            name: newLabel
                        }));
                    } else {
                        // TODO: Error when label already exists
                    }
                }

                this.set('newLabel', null);
            }
        }
    });
});
