define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        id: null,
        title: null,
        source: null,
        thumbnail: null,
        labels: [],
        isLocal: function() {
            return this.get('labels').contains('local');
        }.property('labels.@each')
    });
});
