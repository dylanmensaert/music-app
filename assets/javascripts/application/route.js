/* global document: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Slider = require('slider/object');

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'music',
        // TODO: Implement session support.
        // beforeModel: function() {
        //     return this.store.find('session', 'session').then(function(session) {
        //         if (session.get('isEmpty')) {
        //             session = this.store.createRecord('session').save().then(function(session) {
        //                 session.set('id', 'session');
        //                 return session.save();
        //             });
        //         }
        //         return session;
        //     }.bind(this)).then(function(session) {
        //         this.set('session.instance', session);
        //         return session;
        //     }.bind(this));
        // },
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
