define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/draggable-mixin'), {
        tagName: 'a',
        layoutName: 'snippet',
        classNames: ['list-group-item', 'audio-list', 'outer-panel'],
        classNameBindings: ['snippet.isSelected:active'],
        isDraggable: function() {
            return !Ember.isEmpty(this.get('onDragStart'));
        }.property('onDragStart'),
        selected: null,
        snippet: null,
        onDragStart: null,
        dragStart: function(event) {
            if (this.get('isDraggable')) {
                this._super();

                // TODO: Deselect on select.
                // TODO: Count snippet as 1 of selected when 2+
                // TODO: create callback where selected are only passed onDrag?

                this.onDragStart(event);
            }
        },
        showSelected: function() {
            return this.get('selected') && this.get('isDragging');
        }.property('selected', 'isDragging'),
        click: function(event) {
            this.get('snippet').toggleProperty('isSelected');
        }
    });
});
