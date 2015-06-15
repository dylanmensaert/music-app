define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        tagName: 'li',
        classNameBindings: ['active'],
        active: function() {
            return this.get('childViews').isAny('active');
        }.property('childViews.@each.active')
    });
});
