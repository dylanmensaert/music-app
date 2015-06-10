define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/draggable-mixin'), {
        tagName: 'a',
        layoutName: 'snippet',
        classNames: ['list-group-item', 'audio-list', 'outer-panel'],
        classNameBindings: ['snippet.isSelected:active'],
        attributeBindings: ['name'],
        name: function() {
            return this.get('snippet.id');
        }.property('snippet.id'),
        snippet: null,
        onDragStart: null,
        willDragStart: function(event, ui) {
            this._super();

            this.set('snippet.isSelected', true);

            this.onDragStart(event, ui);
        },
        click: function(event) {
            this.get('snippet').toggleProperty('isSelected');
        }
    });
});
