define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/draggable-mixin'), {
        'handle-component': require('snippet/handle'),
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        snippet: null,
        onDragStart: null,
        willDragStart: function(event, ui) {
            this._super();

            this.set('snippet.isSelected', true);

            this.onDragStart(event, ui);
        },
        click: function() {
            this.sendAction('action', this.get('snippet'));
        },
        actions: {
            toggleSelection: function() {
                this.get('snippet').toggleProperty('isSelected');
            }
        }
    });
});
