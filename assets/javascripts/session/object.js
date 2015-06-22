define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        selectedSnippets: [],
        message: null
    });
});
