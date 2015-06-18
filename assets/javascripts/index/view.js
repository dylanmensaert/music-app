/* global window: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend({
        didInsertElement: function() {
            var viewport = Ember.$(window),
                position,
                maxPosition,
                controller;

            viewport.scroll(function() {
                position = viewport.scrollTop() + viewport.height();
                maxPosition = this.$().offset().top + this.$().outerHeight(true) - viewport.height();

                if (position > maxPosition) {
                    controller = this.get('controller');

                    controller.updateOnlineSnippets(controller.get('nextPageToken'));
                }
            }.bind(this));
        },
        willDestroyElement: function() {
            Ember.$(window).unbind('scroll');
        }
    });
});
