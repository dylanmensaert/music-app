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
        'label-component': require('label/component'),
        'actionBar-component': require('action-bar/component'),
        query: '',
        snippets: [],
        selectedSnippets: function() {
            return this.get('snippets').filterBy('isSelected', true);
        }.property('snippets.@each.isSelected'),
        selectedLabels: function() {
            return this.get('fileSystem.labels').filterBy('isSelected', true);
        }.property('fileSystem.labels.@each.isSelected'),
        showSelected: function() {
            return this.get('selectedSnippets.length') > 1;
        }.property('selectedSnippets.length'),
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
        offlineSnippets: function() {
            var offlineSnippets = [],
                snippets;

            this.get('selectedLabels').forEach(function(label) {
                snippets = this.get('fileSystem.snippets').filter(function(snippet) {
                    return snippet.get('labels').contains(label.get('name')) && !offlineSnippets.isAny('id', snippet.get(
                        'id'));
                });

                offlineSnippets.pushObjects(snippets);
            }.bind(this));

            return offlineSnippets;
        }.property('selectedLabels.@each', 'fileSystem.snippets.@each.labels.@each'),
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                selectedLabels = this.get('selectedLabels'),
                offlineSnippets = this.get('offlineSnippets'),
                promises = [],
                snippets = this.get('snippets'),
                id;

            lastUrl = url;

            if (selectedLabels.isAny('name', 'offline')) {
                // TODO: Implement offline suggestions + results for query..
                // TODO: Check to improve performance
                snippets.pushObjects(offlineSnippets);
            }

            if (selectedLabels.isAny('name', 'online')) {
                this.set('isLoading', true);

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
        },
        searchUrl: function() {
            var url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50',
                label = this.get('fileSystem.labels').findBy('name', 'music-only');
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            if (!Ember.isEmpty(label) && label.get('isSelected')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            return url;
        }.property('selectedLabels.@each', 'query'),
        searchNew: function() {
            this.set('snippets', []);

            this.search(this.get('searchUrl'));
        }.observes('selectedLabels.@each'),
        searchNext: function() {
            var url;

            if (nextPageToken) {
                url = this.get('searchUrl');
                url += '&pageToken=' + nextPageToken;

                this.search(url);
            }
        },
        onSnippetDragStart: function() {
            var labels;

            return function(event, ui) {
                labels = this.get('fileSystem.labels');

                ui.helper.data('snippets', this.get('selectedSnippets'));

                labels.findBy('name', 'online').set('isSelected', false);
                labels.findBy('name', 'queue').set('isSelected', true);
                /*this.transitionToRoute('queue');*/
            }.bind(this);
        }.property('selectedSnippets.@each', 'fileSystem.labels.@each.isSelected'),
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
            },
            play: function(snippet) {
                this.get('audio').load(snippet);

                this.get('audio').play();
            }
        }
    });
});
