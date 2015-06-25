define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'actionBar',
        classNames: ['action-bar', 'btn-primary', 'container', 'text-center'],
        models: null,
        actions: {
            deselect: function() {
                this.get('models').setEach('isSelected', false);
            }
        }
    });
});
