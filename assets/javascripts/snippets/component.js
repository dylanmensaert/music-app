define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend( /*require('helpers/sortable-mixin'), */ {
        'snippet-component': require('snippet/component'),
        layoutName: 'snippets',
        classNames: ['list-group'],
        snippets: null,
        /*setQueue: function(event, ui) {
            Ember.run.scheduleOnce('afterRender', this.$(), function() {
                this.sortable('refresh');
            });

            this.sendAction('didDragStart');
        },*/
        /*onUpdate: function() {
            var snippetIds = this.$().sortable('toArray', {
                attribute: 'name'
            });

            this.sendAction('didUpdate', snippetIds);
        },*/
        actions: {
            play: function(snippet) {
                this.sendAction('action', snippet);
            }
        }
    });
});
