define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        Label = require('label/object'),
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
        searchQuery: null,
        fetchOnlineSuggestions: function(query, callback) {
            var url = meta.suggestHost + '/complete/search?client=firefox&ds=yt',
                suggestions;

            url += '&q=' + query;

            Ember.$.getJSON(url).then(function(response) {
                suggestions = response[1].map(function(suggestion) {
                    return {
                        value: suggestion
                    };
                });

                callback(suggestions);
            });
        },
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                // TODO: labels.@each?
                sortProperties: ['labels', 'name', 'id'],
                orderBy: function(snippet, other) {
                    var offlineFilteredSnippets = this.get('offlineFilteredSnippets'),
                        isOffline = offlineFilteredSnippets.isAny('id', snippet.get('id')),
                        otherIsOffline = offlineFilteredSnippets.isAny('id', other.get('id')),
                        queue,
                        result = -1;

                    if (this.get('queueLabel.isSelected')) {
                        queue = this.get('fileSystem.queue');

                        if (queue.indexOf(snippet.get('id')) > queue.indexOf(other.get('id'))) {
                            result = 1;
                        }
                        // TODO: remove isOffline check if decided to split online and offline search
                    } else if ((!isOffline && otherIsOffline) || (isOffline && otherIsOffline && snippet.get('name') > other.get(
                            'name'))) {
                        result = 1;
                    }

                    return result;
                }.bind(this)
            });
        }.property('snippets'),
        searchOnline: true,
        searchOffline: true,
        // TODO: init in route via setupControl or something? (then same with components)
        musicOnlyLabel: Label.create({
            name: 'music-only',
            isReadOnly: true,
            isSelected: true
        }),
        // TODO: save musicOnly label state (and others) in fileSystem someway
        /*musicOnly: Label.create({
            name: 'music-only',
            isReadOnly: true
        }),*/
        selectedSnippets: function() {
            return this.get('snippets').filterBy('isSelected', true);
        }.property('snippets.@each.isSelected'),
        selectedLabels: function() {
            return this.get('fileSystem.labels').filterBy('isSelected', true);
        }.property('fileSystem.labels.@each.isSelected'),
        showSelected: function() {
            return this.get('selectedSnippets.length') > 1;
        }.property('selectedSnippets.length'),
        offlineFilteredSnippets: function() {
            var offlineFilteredSnippets,
                hasSelectedLabels,
                containsSearchQuery;

            offlineFilteredSnippets = this.get('fileSystem.snippets').filter(function(snippet) {
                hasSelectedLabels = this.get('selectedLabels').every(function(label) {
                    return snippet.get('labels').contains(label.get('name'));
                });

                containsSearchQuery = formatSearch(snippet.get('name')).includes(formatSearch(this.get('searchQuery')));

                return hasSelectedLabels && containsSearchQuery;
            }.bind(this));

            return offlineFilteredSnippets;
        }.property('selectedLabels.@each', 'fileSystem.snippets.@each.labels.@each', 'searchQuery'),
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
                // TODO: Implement offline suggestions + results for searchQuery..
                // TODO: Check to improve performance
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
            var url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50',
                musicOnlyIsSelected = this.get('musicOnlyLabel.isSelected');
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            if (musicOnlyIsSelected) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('searchQuery');

            return url;
        }.property('musicOnlyLabel.isSelected', 'searchQuery'),
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
            // TODO: move load action to playlist
            /*load: function(snippet) {
                this.get('audio').load(snippet);
            },*/
            pushToQueue: function(snippet) {
                var snippets;

                if (Ember.isEmpty(snippet)) {
                    snippets = this.get('selectedSnippets');
                } else {
                    snippets = [snippet];
                }

                snippets.forEach(function(snippet) {
                    if (!snippet.get('isSaved')) {
                        snippet.save();
                    }

                    this.get('fileSystem.queue').pushObject(snippet.get('id'));
                }.bind(this));
            },
            /*didDragStart: function() {
                this.get('fileSystem.labels').setEach('isSelected', false);

                this.get('queueLabel').set('isSelected', true);
            },*/
            /*didUpdate: function(snippetIds) {
                var firstSnippetId = snippetIds.get('firstObject'),
                    hasChangedFirst = this.get('fileSystem.queue.firstObject') !== firstSnippetId,
                    firstSnippet;

                this.set('fileSystem.queue', snippetIds);

                this.get('selectedSnippets').forEach(function(snippet) {
                    if (!snippet.get('isSaved')) {
                        snippet.save();
                    }

                    if (hasChangedFirst && snippet.get('id') === firstSnippetId) {
                        firstSnippet = snippet;
                    }
                });

                if (hasChangedFirst && Ember.isEmpty(firstSnippet)) {
                    firstSnippet = this.get('fileSystem.snippets').findBy('id', firstSnippetId);
                }

                if (!Ember.isEmpty(firstSnippet)) {
                    this.get('audio').play(firstSnippet);
                }
            },*/
        }
    });
});
