/* global window: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    /*TODO: Delete endless scroll functionality?*/
    return Ember.Component.extend({
        didScrollToBottom: null,
        didInsertElement: function() {
            var viewport = Ember.$(window),
                position,
                maxPosition;

            viewport.scroll(function() {
                position = viewport.scrollTop() + viewport.height();
                maxPosition = this.$().offset().top + this.$().outerHeight(true) - viewport.height();

                if (position > maxPosition) {
                    this.didScrollToBottom();
                }
            }.bind(this));

            Ember.$.material.checkbox();
        },
        willDestroyElement: function() {
            Ember.$(window).unbind('scroll');
        }
    });
});
