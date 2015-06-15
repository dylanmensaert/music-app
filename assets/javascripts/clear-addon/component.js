define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'clearAddon',
        classNames: ['input-group-btn'],
        text: null,
        actions: {
            clear: function() {
                this.set('text', null);
            }
        }
    });
});
