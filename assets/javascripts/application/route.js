/* global window: true, document: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Slider = require('slider/object');

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'music',
        setupController: function(controller, model) {
            var audio = this.get('audio'),
                slider,
                queue,
                currentIndex,
                nextIndex,
                nextSnippet;

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

            this.set('cache.slider', slider);

            audio.set('didEnd', this.next.bind(this));

            this._super(controller, model);
        },
        previous: function() {
            var audio = this.get('audio'),
                queue = this.get('fileSystem.queue'),
                currentIndex = queue.indexOf(audio.get('snippet.id')),
                previousIndex,
                previousSnippet;

            if (currentIndex > 0) {
                previousIndex = currentIndex - 1;
            } else {
                previousIndex = queue.get('length');
            }

            previousSnippet = this.get('fileSystem.snippets').findBy('id', queue.objectAt(previousIndex));

            this.play(previousSnippet);
        },
        next: function() {
            var audio = this.get('audio'),
                queue = this.get('fileSystem.queue'),
                currentIndex = queue.indexOf(audio.get('snippet.id')),
                nextIndex,
                nextSnippet;

            if (currentIndex < queue.get('length')) {
                nextIndex = currentIndex + 1;
            } else {
                nextIndex = 0;
            }

            nextSnippet = this.get('fileSystem.snippets').findBy('id', queue.objectAt(nextIndex));

            this.play(nextSnippet);
        },
        play: function(snippet) {
            var playedSnippetIds,
                id;

            if (!Ember.isEmpty(snippet)) {
                playedSnippetIds = this.get('cache.playedSnippetIds');
                id = snippet.get('id');

                if (!playedSnippetIds.contains(id)) {
                    playedSnippetIds.pushObject(id);
                }
            }

            this.get('audio').play(snippet);
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
                this.play(snippet);
            },
            pause: function() {
                this.get('audio').pause();
            },
            scrollToTop: function() {
                window.scrollTo(0, 0);
            },
            previous: function() {
                this.previous();
            },
            next: function() {
                this.next();
            }
        }
    });
});
