/* global window: true, document: true */
define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Slider = require('slider/object'),
        generateRandom;

    generateRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

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
            var history = this.get('fileSystem.history'),
                queue,
                currentIndex,
                previousIndex,
                snippetId,
                previousSnippet;

            if (history.get('length') > 1) {
                snippetId = history.objectAt(history.get('length') - 2);
            } else {
                queue = this.get('fileSystem.queue');
                currentIndex = queue.indexOf(this.get('audio.snippet.id'));

                if (currentIndex > 0) {
                    previousIndex = currentIndex - 1;
                } else {
                    previousIndex = queue.get('length');
                }

                snippetId = queue.objectAt(previousIndex);
            }

            previousSnippet = this.get('fileSystem.snippets').findBy('id', snippetId);

            this.play(previousSnippet);
        },
        next: function() {
            var queue = this.get('fileSystem.queue'),
                currentIndex,
                nextIndex,
                snippetId,
                nextSnippet;

            if (this.get('fileSystem.isRepeating')) {
                currentIndex = queue.indexOf(this.get('audio.snippet.id'));

                if (currentIndex < queue.get('length')) {
                    nextIndex = currentIndex + 1;
                } else {
                    nextIndex = 0;
                }

                snippetId = queue.objectAt(nextIndex);
            } else if (this.get('fileSystem.isShuffling')) {
                unplayedSnippetIds = queue.filter(function(snippetId) {
                    return !this.get('cache.playedSnippetIds').contains(snippetId);
                }.bind(this));

                if (!unplayedSnippetIds.get('length')) {
                    this.set('cache.playedSnippetIds', []);

                    unplayedSnippetIds.pushObjects(queue);

                    unplayedSnippetIds.removeObject(this.get('audio.snippet.id'));
                }

                snippetId = unplayedSnippetIds.objectAt(generateRandom(0, unplayedSnippetIds.get('length') - 1));
            }

            nextSnippet = this.get('fileSystem.snippets').findBy('id', snippetId);

            this.play(nextSnippet);
        },
        play: function(snippet) {
            var offlineSnippets = this.get('fileSystem.snippets'),
                history,
                playedSnippetIds,
                id = snippet.get('id');

            if (!offlineSnippets.isAny('id', id)) {
                offlineSnippets.pushObject(snippet);
            }

            if (!Ember.isEmpty(snippet)) {
                history = this.get('fileSystem.history');
                playedSnippetIds = this.get('cache.playedSnippetIds');

                if (history.contains(id)) {
                    history.removeObject(id);
                }

                history.pushObject(id);

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
