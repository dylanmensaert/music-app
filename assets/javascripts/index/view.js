/* global window: true */
define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend({
        refreshSortable: function() {
            this.$().sortable('refresh');
        }.observes('controller.snippets.@each'),
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

            this.$().sortable({
                revert: 200,
                axis: 'y',
                items: '> .row',
                containment: '.list-group',
                update: function() {
                    var snippetIds = this.$().sortable('toArray', {
                        attribute: 'name'
                    });

                    this.get('controller').didSortQueue(snippetIds);
                }.bind(this),
                delay: 100
            });
        },
        willDestroyElement: function() {
            Ember.$(window).unbind('scroll');

            this.$().sortable('destroy');
        }
    });
});
