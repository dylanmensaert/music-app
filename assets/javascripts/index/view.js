/* global window: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend({
        didInsertElement: function() {
            var viewport = Ember.$(window),
                position,
                maxPosition;

            viewport.scroll(function() {
                position = viewport.scrollTop() + viewport.height();
                maxPosition = this.$().offset().top + this.$().outerHeight(true) - viewport.height();

                if (position > maxPosition) {
                    this.get('controller').searchNext();
                }
            }.bind(this));

            this.get('controller').searchNew();
        },
        willDestroyElement: function() {
            Ember.$(window).unbind('scroll');
        }
    });
});
