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
        query: '',
        snippets: null,
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                filters = this.get('session.model.filters'),
                promises = [],
                snippets = [],
                id;

            lastUrl = url;

            this.set('isLoading', true);

            if (filters.contains('local')) {
                // TODO: Implement local suggestions + results for query..
                snippets.pushObjects(fileSystem.get('snippets'));
            }

            if (filters.contains('youtube')) {
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

            if (this.get('session.model.filters').contains('music-only')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            return url;
        }.property('session.model.filters.@each', 'query'),
        searchNew: function() {
            this.set('snippets', []);

            this.search(this.get('searchUrl'));
        },
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
