define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
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
