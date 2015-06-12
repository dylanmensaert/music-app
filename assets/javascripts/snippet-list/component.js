define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/sortable-mixin'), {
        layoutName: 'snippetList',
        classNames: ['list-group'],
        'snippet-component': require('snippet/component'),
        snippets: null,
        refreshSortable: function() {
            this.$().sortable('refresh');
        }.observes('snippets.@each'),
        onUpdate: function() {
            var snippetIds = this.$().sortable('toArray', {
                attribute: 'name'
            });

            this.sendAction('didUpdate', snippetIds);
        },
        actions: {
            play: function(snippet) {
                this.sendAction('action', snippet);
            },
            didDragStart: function() {
                this.sendAction('didDragStart');
            }
        }
    });
});
