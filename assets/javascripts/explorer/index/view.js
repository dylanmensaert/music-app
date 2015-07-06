/* global window: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend({
        /*TODO: Delete endless scroll functionality?*/
        didInsertElement: function() {
            var viewport = Ember.$(window),
                controller = this.get('controller'),
                position,
                maxPosition;

            viewport.scroll(function() {
                position = viewport.scrollTop() + viewport.height();
                maxPosition = this.$().offset().top + this.$().outerHeight(true) - viewport.height();

                if (position > maxPosition) {
                    controller.updateOnlineSnippets(controller.get('nextPageToken'));
                }
            }.bind(this));

            Ember.$.material.checkbox();

            if (controller.get('searchOnline')) {
                controller.scheduleUpdateOnlineSnippets();
            }
        },
        willDestroyElement: function() {
            Ember.$(window).unbind('scroll');
        }
    });
});
