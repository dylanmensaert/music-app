define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        id: null,
        title: null,
        extension: null,
        source: function() {
            return 'filesystem:http://www.example.com/audio/' + this.get('id') + this.get('extension');
        }.property('id', 'extension'),
        thumbnail: null,
        labels: [],
        isLocal: function() {
            return this.get('labels').contains('local');
        }.property('labels.@each')
    });
});
