define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        utilities = require('helpers/utilities'),
        convertImageUrl;

    convertImageUrl = function(url) {
        return meta.imageHost + new URL(url).pathname;
    };

    /*TODO: lot of duplication with queue controller. Maybe implement via mixin*/
    return Ember.Controller.extend({
        liveQuery: '',
        query: '',
        fetchSuggestions: function() {
            var url,
                title,
                lastQuery;

            return function(query, callback) {
                var suggestions = [],
                    matches;

                lastQuery = query;

                if (this.get('searchOffline')) {
                    this.get('fileSystem.snippets').forEach(function(snippet) {
                        title = snippet.get('title');

                        matches = snippet.match(query).map(function() {
                            return {
                                value: title
                            };
                        });

                        suggestions.pushObjects(matches);
                    });

                    callback(suggestions);
                }

                if (this.get('searchOnline') && suggestions.get('length') < 10) {
                    url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + query;

                    (function(oldQuery) {
                        Ember.$.getJSON(url).then(function(response) {
                            if (oldQuery === lastQuery) {
                                response[1].forEach(function(suggestion) {
                                    if (!suggestions.isAny('value', suggestion)) {
                                        suggestions.pushObject({
                                            value: suggestion
                                        });
                                    }
                                });

                                callback(suggestions);
                            }
                        });
                    })(lastQuery);
                }
            }.bind(this);
        }.property('searchOffline', 'searchOnline', 'fileSystem.snippets.@each.title'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['title', 'id'],
                orderBy: function(snippet, other) {
                    var offlineSnippets = this.get('offlineSnippets'),
                        isOffline = offlineSnippets.isAny('id', snippet.get('id')),
                        otherIsOffline = offlineSnippets.isAny('id', other.get('id')),
                        snippets = this.get('snippets'),
                        result = -1;

                    if ((!isOffline && otherIsOffline) || (isOffline && otherIsOffline && snippet.get('title') > other.get(
                            'title')) || (!isOffline && !otherIsOffline && snippets.indexOf(snippet) > snippets.indexOf(other))) {
                        result = 1;
                    }

                    return result;
                }.bind(this)
            });
        }.property('snippets.@each', 'offlineSnippets.@each.id'),
        // TODO: save musicOnly label state (and others) in fileSystem someway
        searchOnline: false,
        searchMusicOnly: false,
        searchOffline: true,
        snippets: function() {
            var snippets = [];

            snippets.pushObjects(this.get('offlineSnippets'));

            this.get('onlineSnippets').forEach(function(snippet) {
                if (!snippets.isAny('id', snippet.get('id'))) {
                    snippets.pushObject(snippet);
                }
            });

            return snippets;
        }.property('offlineSnippets.@each', 'onlineSnippets.@each'),
        offlineSnippets: function() {
            var snippets = [],
                query,
                offlineSnippets;

            if (this.get('searchOffline')) {
                query = this.get('query');

                offlineSnippets = this.get('fileSystem.snippets').filter(function(snippet) {
                    return snippet.match(query).get('length');
                });

                snippets = offlineSnippets;
            }

            return snippets;
        }.property('query', 'fileSystem.snippets.@each.title', 'searchOffline'),
        nextPageToken: null,
        isLoading: false,
        onlineSnippets: [],
        updateOnlineSnippets: function(nextPageToken) {
            var url,
                snippets;

            if (this.get('searchOnline')) {
                url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
                this.set('isLoading', true);

                // TODO: url += '&relatedToVideoId=' + this.get('videoId');
                if (this.get('searchMusicOnly')) {
                    url += '&videoCategoryId=10';
                }

                url += '&key=' + meta.key;
                url += '&q=' + this.get('query');

                if (!Ember.isEmpty(nextPageToken)) {
                    url += '&pageToken=' + nextPageToken;
                }

                Ember.$.getJSON(url).then(function(response) {
                    snippets = response.items.map(function(item) {
                        return Snippet.create({
                            id: item.id.videoId,
                            title: item.snippet.title,
                            extension: 'mp3',
                            thumbnail: convertImageUrl(item.snippet.thumbnails.high.url),
                            // TODO: Remove if possible
                            fileSystem: this.get('fileSystem')
                        });
                    }.bind(this));

                    if (Ember.isEmpty(nextPageToken)) {
                        this.set('onlineSnippets', snippets);
                    } else {
                        this.get('onlineSnippets').pushObjects(snippets);
                    }

                    if (Ember.isEmpty(response.nextPageToken)) {
                        nextPageToken = null;
                    } else {
                        nextPageToken = response.nextPageToken;
                    }

                    this.set('nextPageToken', nextPageToken);

                    this.set('isLoading', false);
                }.bind(this));
            }
        },
        scheduleUpdateOnlineSnippets: function() {
            Ember.run.once(this, this.updateOnlineSnippets);
        }.observes('query', 'searchOnline', 'searchMusicOnly'),
        /*TODO: Implement another way?*/
        updateSelectedSnippets: function() {
            var selectedSnippets = this.get('snippets').filterBy('isSelected');

            this.set('session.selectedSnippets', selectedSnippets);
        }.observes('snippets.@each.isSelected'),
        actions: {
            search: function() {
                this.set('query', this.get('liveQuery'));
            },
            /*TODO: Figure out if will select on snippet drag? else implement snippets.pushObject(snippet);*/
            pushToQueue: function(snippet) {
                var snippets = this.get('snippets').filterBy('isSelected');

                snippets.forEach(function(snippet) {
                    if (!snippet.get('isSaved')) {
                        snippet.save();
                    }

                    this.get('fileSystem.queue').pushObject(snippet.get('id'));
                }.bind(this));
            },
            save: function(snippet) {
                var snippets = this.get('fileSystem.snippets').filterBy('isSelected');

                snippets.forEach(function(snippet) {
                    /*TODO: Check if wifi, else add label and this.get('fileSystem.snippets').push.. Also make compatible with browser*/
                    if (!snippet.get('isSaved')) {
                        snippet.save();
                    }
                });
            },
            toggle: function(property) {
                this.toggleProperty(property);
            }
        }
    });
});
