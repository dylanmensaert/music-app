define(function(require) {
    'use strict';

    var DS = require('ember-data');

    return DS.Model.extend({
        // TODO: initialize as empty array
        filters: ['youtube', 'local']
    });
});
