define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        lastUrl,
        nextPageToken,
        convertImageUrl;

    convertImageUrl = function(url) {
        return meta.imageHost + new URL(url).pathname;
    };

    return Ember.Controller.extend({
        'snippet-component': require('snippet/component'),
        'actionBar-component': require('action-bar/component'),
        query: '',
        snippets: [],
        selectedSnippets: function() {
            return this.get('snippets').filterBy('isSelected', true);
        }.property('snippets.@each.isSelected'),
        online: function() {
            return this.get('fileSystem.labels').findBy('name', 'online');
        }.property('fileSystem'),
        offline: function() {
            return this.get('fileSystem.labels').findBy('name', 'offline');
        }.property('fileSystem'),
        musicOnly: function() {
            return this.get('fileSystem.labels').findBy('name', 'music-only');
        }.property('fileSystem'),
        labels: function() {
            var name;

            return this.get('fileSystem.labels').filter(function(label) {
                name = label.get('name');

                return name !== 'online' && name !== 'offline' && name !== 'music-only';
            });
        }.property('fileSystem.labels.@each'),
        localSnippets: function() {
            var localSnippets = [],
                snippets;

            this.get('fileSystem.labels').forEach(function(label) {
                if (label.get('isVisible')) {
                    snippets = this.get('fileSystem.snippets').filter(function(snippet) {
                        return snippet.get('labels').contains(label.get('name')) && !localSnippets.isAny('id', snippet.get(
                            'id'));
                    });

                    localSnippets.pushObjects(snippets);
                }
            }.bind(this));

            return localSnippets;
        }.property('fileSystem.labels.@each.isVisible', 'fileSystem.snippets.@each.labels.@each'),
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                visibleLabels = this.get('fileSystem.labels').filterBy('isVisible', true),
                localSnippets = this.get('localSnippets'),
                promises = [],
                snippets = this.get('snippets'),
                id;

            lastUrl = url;

            if (visibleLabels.isAny('name', 'offline')) {
                // TODO: Implement local suggestions + results for query..
                // TODO: Check to improve performance
                snippets.pushObjects(localSnippets);
            }

            if (visibleLabels.isAny('name', 'online')) {
                this.set('isLoading', true);

                Ember.$.getJSON(url).then(function(response) {
                    if (lastUrl === url) {
                        response.items.forEach(function(item) {
                            id = item.id.videoId;

                            if (!localSnippets.isAny('id', id)) {
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
                label = this.get('fileSystem.labels').findBy('name', 'music-only');
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            if (!Ember.isEmpty(label) && label.get('isVisible')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            return url;
        }.property('fileSystem.labels.@each.isVisible', 'query'),
        searchNew: function() {
            this.set('snippets', []);

            this.search(this.get('searchUrl'));
        }.observes('fileSystem.labels.@each.isVisible'),
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
            clear: function() {
                this.set('query', '');
            },
            toggleMusicOnly: function() {
                this.toggleProperty('session.model.musicOnly');

                this.searchNew();
            }
        }
    });
});
