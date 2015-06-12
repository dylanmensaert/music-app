define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/draggable-mixin'), {
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        classNameBindings: ['snippet.isSelected:active'],
        snippet: null,
        onDragStart: function() {
            this.set('snippet.isSelected', true);

            this.sendAction('didDragStart');
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
