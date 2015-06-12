define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        classNameBindings: ['snippet.isSelected:active'],
        snippet: null,
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
