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
            var playingSnippetId = this.get('fileSystem.playingSnippetId'),
                audio = this.get('audio'),
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

            this.set('cache.slider', slider);

            audio.set('didEnd', this.next.bind(this));

            if (!Ember.isEmpty(playingSnippetId)) {
                audio.load(this.get('fileSystem.snippets').findBy('id', playingSnippetId));
            }

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
                snippetId,
                nextSnippet;

            unplayedSnippetIds = queue.filter(function(snippetId) {
                return !this.get('cache.playedSnippetIds').contains(snippetId);
            }.bind(this));

            if (!unplayedSnippetIds.get('length')) {
                this.set('cache.playedSnippetIds', []);

                unplayedSnippetIds.pushObjects(queue);

                unplayedSnippetIds.removeObject(this.get('audio.snippet.id'));
            }

            snippetId = unplayedSnippetIds.objectAt(generateRandom(0, unplayedSnippetIds.get('length') - 1));

            nextSnippet = this.get('fileSystem.snippets').findBy('id', snippetId);

            this.play(nextSnippet);
        },
        play: function(snippet) {
            var offlineSnippets = this.get('fileSystem.snippets'),
                history,
                queue,
                playedSnippetIds,
                id;

            if (!Ember.isEmpty(snippet)) {
                id = snippet.get('id');
                history = this.get('fileSystem.history');
                queue = this.get('fileSystem.queue');
                playedSnippetIds = this.get('cache.playedSnippetIds');

                if (!offlineSnippets.isAny('id', id)) {
                    offlineSnippets.pushObject(snippet);
                }

                if (history.contains(id)) {
                    history.removeObject(id);
                }

                if (history.get('length') === 50) {
                    history.removeAt(0);
                }

                history.pushObject(id);

                if (!queue.contains(id)) {
                    if (Ember.isEmpty(this.get('audio.snippet.id'))) {
                        queue.pushObject(id);
                    } else {
                        queue.insertAt(queue.indexOf(this.get('audio.snippet.id')) + 1, id);
                    }
                }

                if (!playedSnippetIds.contains(id)) {
                    playedSnippetIds.pushObject(id);
                }

                this.set('fileSystem.playingSnippetId', id);
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
                if (Ember.$(window).scrollTop()) {
                    window.scrollTo(0, 0);
                } else {
                    this.set('cache.message', 'Already scrolled to top');
                }
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
