define(function(require) {
    'use strict';

    var Ember = require('ember'),
        debouncer;

    return Ember.Component.extend({
        layoutName: 'message_bar',
        classNames: ['message-bar'],
        content: null,
        fading: false,
        visible: false,
        fadeOut: function() {
            this.set('fading', true);

            this.$().fadeOut(500, function() {
                this.set('fading', false);
                this.set('visible', false)
            }.bind(this));
        },
        update: function() {
            if (!Ember.isEmpty(this.get('content'))) {
                if (this.get('fading')) {
                    this.$().stop(true, true).fadeOut();
                }

                if (!this.get('visible')) {
                    this.$().show();
                }

                debouncer = Ember.run.debounce(this, this.fadeOut, 2000);
            }
        }.observes('content').on('didInsertElement'),
        click: function() {
            Ember.run.cancel(debouncer);

            if (!this.get('fading')) {
                this.fadeOut();
            }
        },
        didInsertElement: function() {
            this.$().hide();
        }
    });
});
