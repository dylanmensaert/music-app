/* global location: true, escape: true, XMLHttpRequest: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        name: null,
        isVisible: true,
        isReadOnly: false,
        toJSON: function() {
            return JSON.stringify(this.getProperties('name', 'isVisible'));
        }
    });
});
