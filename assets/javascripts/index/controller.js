define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        lastUrl,
        nextPageToken,
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
                    offlineSuggestions = this.get('offlineSnippets').map(function(snippet) {
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
        }.property('searchOffline', 'searchOnline', 'offlineSnippets.@each'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['name', 'id'],
                orderBy: function(snippet, other) {
                    var offlineSnippets = this.get('offlineSnippets'),
                        isOffline = offlineSnippets.isAny('id', snippet.get('id')),
                        otherIsOffline = offlineSnippets.isAny('id', other.get('id')),
                        result = -1;

                    // TODO: remove isOffline check if decided to split online and offline search
                    if ((!isOffline && otherIsOffline) || (isOffline && otherIsOffline && snippet.get('name') > other.get(
                            'name'))) {
                        result = 1;
                    }

                    return result;
                }.bind(this)
            });
        }.property('snippets'),
        // TODO: save musicOnly label state (and others) in fileSystem someway
        searchOnline: true,
        searchMusicOnly: true,
        searchOffline: true,
        snippets: function() {
            var snippets = this.get('offlineSnippets');

            snippets.pushObjects(this.get('onlineSnippets'));

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
        onlineSnippets: function() {
            var url,
                nextPageToken,
                snippets = [];

            if (this.get('searchOnline')) {
                url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
                nextPageToken = this.get('nextPageToken');

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
                    if (lastUrl === url) {
                        response.items.forEach(function(item) {
                            id = item.id.videoId;

                            if (!offlineSnippets.isAny('id', id)) {
                                snippets.pushObject(Snippet.create({
                                    id: id,
                                    title: item.snippet.title,
                                    extension: 'mp3',
                                    thumbnail: convertImageUrl(item.snippet.thumbnails.high.url),
                                    fileSystem: fileSystem
                                }));
                            }
                        });

                        if (Ember.isEmpty(response.nextPageToken)) {
                            nextPageToken = null;
                        } else {
                            nextPageToken = response.nextPageToken;
                        }

                        this.set('isLoading', false);
                    }
                }.bind(this));
            }

            return snippets;
        }.property('query', 'searchOnline', 'searchMusicOnly'),
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
