define(function(require) {
    'use strict';

    var Ember = require('ember'),
        DS = require('ember-data'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        convertImageUrl,
        formatSearch;

    convertImageUrl = function(url) {
        return meta.imageHost + new URL(url).pathname;
    };

    formatSearch = function(value) {
        return value.toLowerCase().replace(/\s/g, '')
    };

    return Ember.Controller.extend({
        'label-component': require('label/component'),
        'snippets-component': require('snippets/component'),
        liveQuery: '',
        query: '',
        fetchSuggestions: function() {
            var url,
                offlineSuggestions,
                onlineSuggestions,
                lastQuery;

            return function(query, callback) {
                var suggestions = [];

                lastQuery = query;

                if (this.get('searchOffline')) {
                    offlineSuggestions = this.get('fileSystem.snippets').map(function(snippet) {
                        return {
                            value: snippet.get('name')
                        };
                    });

                    suggestions.pushObjects(offlineSuggestions);
                    callback(suggestions);
                }

                if (this.get('searchOnline')) {
                    url = meta.suggestHost + '/complete/search?client=firefox&ds=yt&q=' + query;

                    (function(oldQuery) {
                        Ember.$.getJSON(url).then(function(response) {
                            if (oldQuery === lastQuery) {
                                onlineSuggestions = response[1].map(function(suggestion) {
                                    return {
                                        value: suggestion
                                    };
                                });

                                suggestions.pushObjects(onlineSuggestions);
                                callback(suggestions);
                            }
                        });
                    })(lastQuery);
                }
            }.bind(this);
        }.property('searchOffline', 'searchOnline', 'fileSystem.snippets.@each.name'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['name', 'id'],
                orderBy: function(snippet, other) {
                    var offlineSnippets = this.get('offlineSnippets'),
                        isOffline = offlineSnippets.isAny('id', snippet.get('id')),
                        otherIsOffline = offlineSnippets.isAny('id', other.get('id')),
                        snippets = this.get('snippets'),
                        result = -1;

                    // Does not seem to work entirely correct
                    if ((!isOffline && otherIsOffline) || (isOffline && otherIsOffline && snippet.get('name') > other.get(
                            'name')) || (!isOffline && !otherIsOffline && snippets.indexOf(snippet) > snippets.indexOf(other))) {
                        result = 1;
                    }
                }.bind(this)
            });
        }.property('snippets.@each', 'offlineSnippets.@each.id'),
        // TODO: save musicOnly label state (and others) in fileSystem someway
        searchOnline: true,
        searchMusicOnly: true,
        searchOffline: true,
        snippets: function() {
            var snippets = this.get('offlineSnippets');

            this.get('onlineSnippets').forEach(function(snippet) {
                if (!snippets.isAny('id', snippet.get('id'))) {
                    snippets.pushObject(snippet);
                }
            });

            return snippets;
        }.property('offlineSnippets.@each', 'onlineSnippets.@each'),
        /*TODO: Implement this as a function instead of property?*/
        offlineSnippets: function() {
            var snippets = [],
                offlineSnippets;

            if (this.get('searchOffline')) {
                offlineSnippets = this.get('fileSystem.snippets').filter(function(snippet) {
                    /*TODO: Implement label search also?*/
                    return formatSearch(snippet.get('name')).includes(formatSearch(this.get('query')));
                }.bind(this));

                snippets.pushObjects(offlineSnippets);
            }

            return snippets;
        }.property('query', 'fileSystem.snippets.@each.name', 'searchOffline'),
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
                    // Implement as searchNext because it will not work this way.
                    url += '&pageToken=' + nextPageToken;
                }

                Ember.$.getJSON(url).then(function(response) {
                    if (Ember.isEmpty(response.nextPageToken)) {
                        nextPageToken = null;
                    } else {
                        nextPageToken = response.nextPageToken;
                    }

                    this.set('nextPageToken', nextPageToken);

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

                    this.set('onlineSnippets', snippets);

                    this.set('isLoading', false);
                }.bind(this));
            }
        },
        scheduleUpdateOnlineSnippets: function() {
            Ember.run.once(this, this.updateOnlineSnippets);
        }.observes('query', 'searchOnline', 'searchMusicOnly'),
        actions: {
            search: function() {
                this.set('query', this.get('liveQuery'));
            },
            /*TODO: Figure out if will select on snippet drag? else implement snippets.pushObject(snippet);*/
            pushToQueue: function(snippet) {
                var snippets = this.get('fileSystem.snippets').filterBy('isSelected');

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
