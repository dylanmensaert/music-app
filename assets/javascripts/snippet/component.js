define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/draggable-mixin'), {
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        classNameBindings: ['snippet.isSelected:active'],
        snippet: null,
        onDragStart: null,
        willDragStart: function(event, ui) {
            this._super();

            this.set('snippet.isSelected', true);

            this.onDragStart(event, ui);
        },
        actions: {
            toggleSelection: function() {
                this.get('snippet').toggleProperty('isSelected');
            },
            click: function() {
                this.sendAction('action', this.get('snippet'));
            }
        }
    });
});
