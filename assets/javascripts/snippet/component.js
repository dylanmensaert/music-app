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
        snippet: null,
        onDragStart: null,
        dragStart: function(event) {
            if (this.get('isDraggable')) {
                this._super();

                this.set('snippet.isSelected', true);

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
