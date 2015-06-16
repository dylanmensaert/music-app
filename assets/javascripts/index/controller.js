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
        snippets: [],
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
                    offlineSuggestions = this.get('offlineFilteredSnippets').map(function(snippet) {
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
        }.property('searchOffline', 'searchOnline', 'offlineFilteredSnippets'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['name', 'id'],
                orderBy: function(snippet, other) {
                    var offlineFilteredSnippets = this.get('offlineFilteredSnippets'),
                        isOffline = offlineFilteredSnippets.isAny('id', snippet.get('id')),
                        otherIsOffline = offlineFilteredSnippets.isAny('id', other.get('id')),
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
        offlineFilteredSnippets: function() {
            return this.get('fileSystem.snippets').filter(function(snippet) {
                /*TODO: Implement label search also?*/
                return formatSearch(snippet.get('name')).includes(formatSearch(this.get('query')));
            }.bind(this));
        }.property('query'),
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                selectedLabels = this.get('selectedLabels'),
                offlineFilteredSnippets = this.get('offlineFilteredSnippets'),
                promises = [],
                snippets = this.get('snippets'),
                id;

            lastUrl = url;

            if (this.get('searchOffline')) {
                snippets.pushObjects(offlineFilteredSnippets);
            }

            if (this.get('searchOnline')) {
                this.set('isLoading', true);

                Ember.$.getJSON(url).then(function(response) {
                    if (lastUrl === url) {
                        response.items.forEach(function(item) {
                            id = item.id.videoId;

                            if (!offlineFilteredSnippets.isAny('id', id)) {
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
        },
        searchUrl: function() {
            var url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            if (this.get('searchMusicOnly')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            return url;
        }.property('searchMusicOnly', 'query'),
        searchNew: function() {
            this.set('snippets', []);

            this.search(this.get('searchUrl'));
        }.observes('searchOffline', 'searchOnline'),
        searchNext: function() {
            var url;

            if (nextPageToken) {
                url = this.get('searchUrl');
                url += '&pageToken=' + nextPageToken;

                this.search(url);
            }
        },
        actions: {
            search: function() {
                this.searchNew();
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
