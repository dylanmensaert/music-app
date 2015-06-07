/* global window: true, document: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Slider = require('slider/object'),
        sessionId = 'singleton';

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'music',
        setupController: function(controller, model) {
            var audio = this.get('audio'),
                slider;

            slider = Slider.create({
                onSlideStop: function(value) {
                    audio.setCurrentTime(value);
                }
            });

            audio.addObserver('currentTime', audio, function() {
                slider.setValue(this.get('currentTime'));
            });

            audio.addObserver('duration', audio, function() {
                slider.set('max', this.get('duration'));
            });

            controller.set('slider', slider);

            this._super(controller, model);
        },
        actions: {
            loading: function() {
                if (this.get('controller')) {
                    this.set('controller.isLoading', true);

                    this.router.one('didTransition', function() {
                        this.set('controller.isLoading', false);
                    }.bind(this));
                }
            },
            error: function(error) {
                if (this.get('controller')) {
                    this.set('controller.error', error);
                }
            },
            updateTitle: function(tokens) {
                this._super(tokens);

                tokens.reverse();
                document.title = tokens.join(' - ');
            }
        }
    });
});
