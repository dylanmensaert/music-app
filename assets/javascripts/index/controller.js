define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('objects/snippet'),
        lastUrl,
        nextPageToken,
        convertImageUrl;

    convertImageUrl = function(url) {
        return meta.imageHost + new URL(url).pathname;
    };

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        online: function() {
            return this.get('fileSystem.labels').findBy('name', 'online');
        }.property('fileSystem.labels.@each'),
        offline: function() {
            return this.get('fileSystem.labels').findBy('name', 'offline');
        }.property('fileSystem.labels.@each'),
        musicOnly: function() {
            return this.get('fileSystem.labels').findBy('name', 'music-only');
        }.property('fileSystem.labels.@each'),
        labels: function() {
            var name;

            return this.get('fileSystem.labels').filter(function(label) {
                name = label.get('name');

                return name !== 'online' && name !== 'offline' && name !== 'music-only';
            });
        }.property('fileSystem.labels.@each'),
        filteredSnippets: function() {
            var filteredSnippets = [],
                snippets;

            this.get('fileSystem.labels').forEach(function(label) {
                if(label.get('isVisible')) {
                    snippets = fileSystem.get('snippets').filter(function(snippet) {
                        return snippet.get('labels').contains(label.get('name')) && !filteredSnippets.isAny('id', snippet.get('id'));
                    });

                    filteredSnippets.pushObjects(snippets);   
                }
            });

            return filteredSnippets;
        }.property('fileSystem.labels.@each.isVisible', 'fileSystem.snippets.@each.labels.@each'),
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                visibleLabels = this.get('fileSystem.labels').filterBy('isVisible', true),
                promises = [],
                snippets = [],
                id;

            lastUrl = url;

            this.set('isLoading', true);

            if (visibleLabels.isAny('name', 'offline')) {
                // TODO: Implement local suggestions + results for query..
                // TODO: Check to improve performance
               snippets.pushObjects(this.get('filteredSnippets'));
            }

            if (visibleLabels.isAny('name', 'online')) {
                promises.push(Ember.$.getJSON(url).then(function(response) {

                    response.items.forEach(function(item) {
                        id = item.id.videoId;

                        if (!fileSystem.contains('id', id)) {
                            snippets.pushObject(Snippet.create({
                                id: id,
                                title: item.snippet.title,
                                extension: 'mp3',
                                thumbnail: convertImageUrl(item.snippet.thumbnails.high.url),
                                labels: ['youtube'],
                                fileSystem: fileSystem
                            }));
                        }
                    });

                    if (Ember.isEmpty(response.nextPageToken)) {
                        nextPageToken = null;
                    } else {
                        nextPageToken = response.nextPageToken;
                    }
                }.bind(this)));
            }

            Ember.RSVP.Promise.all(promises).then(function() {
                if (lastUrl === url) {
                    this.get('snippets').pushObjects(snippets);

                    this.set('isLoading', false);
                }
            }.bind(this));
        },
        searchUrl: function() {
            var url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            if (this.get('fileSystem.labels')findBy('name', 'music-only').get('isVisible')) {
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
            // TODO: set class 'active' on currently playing
            load: function(snippet) {
                this.get('audio').load(snippet);
            },
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
