define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend(require('helpers/sortable-mixin'), {
        didUpdate: function() {
            var snippetIds = this.$().sortable('toArray', {
                attribute: 'name'
            });

            this.get('controller').didUpdate(snippetIds);
        }
    });
});
