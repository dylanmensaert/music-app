define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'suggest_input_group',
        classNames: ['form-group-material-grey-500', 'spaced-top'],
        liveQuery: null,
        editPlaceholder: null,
        fetchSuggestions: null,
        isEditMode: false,
        actions: {
            // TODO: Clearing input does not work. Seems like bug regarding material design.
            clear: function() {
                this.$('input').focus();

                this.set('liveQuery', '');
            },
            saveEdit: function() {
                this.sendAction('saveEdit');
            },
            search: function() {
                this.sendAction('search');
            }
        }
    });
});
