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
                slider,
                queue,
                snippet,
                snippetId;

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

            audio.set('didEnd', function() {
                queue = this.get('fileSystem.queue');
                snippet = audio.get('snippet');
                snippetId = snippet.get('id');

                queue.removeObject(snippetId);
                queue.pushObject(snippetId);

                snippetId = this.get('firstObject');
                snippet = this.get('fileSystem.snippets').findBy('id', snippetId);

                audio.play(snippet);
            }.bind(this));

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
            },
            play: function(snippet) {
                if (!Ember.isEmpty(snippet)) {
                    this.get('fileSystem.queue').unshiftObject(snippet.get('id'));
                }

                this.get('audio').play(snippet);
            }
        }
    });
});
