define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object'),
        searchNew;

    searchNew = function() {
        this.set('snippets', []);

        this.search(this.get('searchUrl'));
    };

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        nextPageToken: null,
        isLoading: false,
        search: function(url) {
            var fileSystem = this.get('fileSystem'),
                filters = this.get('session.model.filters'),
                promises = [],
                snippets = [],
                id,
                nextPageToken;

            if (!this.get('isLoading')) {
                this.set('isLoading', true);

                if (filters.contains('local')) {
                    snippets.pushObjects(fileSystem.get('snippets'));
                }

                if (filters.contains('youtube')) {
                    promises.push(Ember.$.getJSON(url).then(function(response) {
                        id = item.id.videoId;

                        if (!fileSystem.contains('id', id)) {
                            snippets.pushObject(Snippet.create({
                                id: id,
                                title: item.snippet.title,
                                extension: 'mp3',
                                thumbnail: item.snippet.thumbnails.high.url,
                                labels: ['youtube'],
                                fileSystem: fileSystem
                            }));
                        }

                        if (Ember.isEmpty(response.nextPageToken)) {
                            nextPageToken = null;
                        } else {
                            nextPageToken = response.nextPageToken;
                        }

                        this.set('nextPageToken', nextPageToken);
                    }.bind(this)));
                }

                Ember.RSVP.Promise.all(promises).then(function() {
                    this.get('snippets').pushObjects(snippets);

                    this.set('isLoading', false);
                }.bind(this));
            }
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
        debounceSearchNew: function() {
            Ember.run.debounce(this, searchNew, 100, true);
        }.observes('searchUrl'),
        searchNext: function() {
            var nextPageToken = this.get('nextPageToken'),
                url;

            if (nextPageToken) {
                url = this.get('searchUrl');
                url += '&pageToken=' + nextPageToken;

                this.search(url);
            }
        },
        actions: {
            // TODO: set class 'active' on currently playing
            load: function(snippet) {
                this.get('audio').load(snippet);
            },
            clear: function() {
                this.set('query', '');
            },
            toggleMusicOnly: function() {
                this.toggleProperty('session.model.musicOnly');

                this.debounceSearchNew();
            }
        }
    });
});
