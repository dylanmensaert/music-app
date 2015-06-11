define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        name: null,
        isReadOnly: false,
        isSelected: false,
        strip: function() {
            return this.getProperties('name', 'isReadOnly', 'isSelected');
        }
    });
});
