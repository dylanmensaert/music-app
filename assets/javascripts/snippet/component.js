define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        tagName: 'a',
        templateName: 'snippet',
        classNames: ['list-group-item', 'audio-list'],
        classNameBindings: ['snippet.isSelected:active'],
        snippet: null,
        click: function(event) {
            this.get('snippet').toggleProperty('isSelected');
        }
    });
});
