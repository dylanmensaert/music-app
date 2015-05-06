define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('snippet/object');

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        nextPageToken: null,
        isLoading: false,
        filters: [],
        search: function(url, load) {
            var fileSystem = this.get('fileSystem'),
                snippets = [],
                id,
                nextPageToken;

            if (!this.get('isLoading')) {
                this.set('isLoading', true);

                if (this.get('filters').contains('local')) {
                    this.get('fileSystem').fetchData().then(function(data) {
                        snippets.pushObjects(data.get('snippets'));
                    });
                }

                if (this.get('filters').contains('youtube')) {
                    Ember.$.getJSON(url).then(function(response) {
                        id = item.id.videoId;

                        // TODO: Implement correctly
                        /*if (!data.contains('id', id)) {*/
                        snippets.pushObject(Snippet.create({
                            id: id,
                            title: item.snippet.title,
                            extension: 'mp3',
                            thumbnail: item.snippet.thumbnails.high.url,
                            labels: ['youtube'],
                            fileSystem: fileSystem
                        }));
                        /*}*/

                        if (Ember.isEmpty(response.nextPageToken)) {
                            nextPageToken = null;
                        } else {
                            nextPageToken = response.nextPageToken;
                        }

                        this.set('nextPageToken', nextPageToken);
                        this.set('isLoading', false);

                        load(snippets);
                    }.bind(this));
                }
            }
        },
        searchUrl: function() {
            var url = meta.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            // TODO: implement in settings page?
            if (this.get('session.model.musicOnly')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + meta.key;
            url += '&q=' + this.get('query');

            return url;
        }.property('session.model.musicOnly', 'query'),
        searchNew: function() {
            this.search(this.get('searchUrl'), function(snippets) {
                this.set('snippets', snippets);
            }.bind(this));
        },
        searchNext: function() {
            var nextPageToken = this.get('nextPageToken'),
                url;

            if (nextPageToken) {
                url = this.get('searchUrl');
                url += '&pageToken=' + nextPageToken;

                this.search(url, function(snippets) {
                    this.get('snippets').pushObjects(snippets);
                }.bind(this));
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
