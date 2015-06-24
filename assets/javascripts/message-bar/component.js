define(function(require) {
    'use strict';

    var Ember = require('ember'),
        debouncer;

    return Ember.Component.extend({
        layoutName: 'messageBar',
        classNames: ['message-bar'],
        content: null,
        fadeOut: function() {
            this.$().fadeOut(500, function() {
                this.set('content', null);
            }.bind(this));
        },
        update: function() {
            if (!Ember.isEmpty(this.get('content'))) {
                debouncer = Ember.run.debounce(this, this.fadeOut, 2000);
            }
        }.observes('content').on('didInsertElement'),
        click: function() {
            Ember.run.cancel(debouncer);

            this.fadeOut();
        }
    });
});
