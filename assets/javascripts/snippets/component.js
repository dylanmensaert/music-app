define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        'snippet-component': require('snippet/component'),
        layoutName: 'snippets',
        classNames: ['list-group'],
        snippets: null,
        actions: {
            play: function(snippet) {
                this.sendAction('action', snippet);
            }
        }
    });
});
