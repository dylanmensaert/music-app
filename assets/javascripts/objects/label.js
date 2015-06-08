define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        name: null,
        isVisible: true,
        isReadOnly: false,
        strip: function() {
            return this.getProperties('name', 'isVisible', 'isReadOnly');
        }
    });
});
