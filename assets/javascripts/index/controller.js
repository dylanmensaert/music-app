define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        Snippet = require('helpers/snippet'),
        extractExtension;

    extractExtension = function(source) {
        return source.substr(source.lastIndexOf('.'), source.length);
    };

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        nextPageToken: null,
        isLoading: false,
        search: function(url, save) {
            var snippets,
                nextPageToken,
                source;

            if (!this.get('isLoading')) {
                this.set('isLoading', true);

                Ember.$.getJSON(url).then(function(response) {
                    snippets = response.items.map(function(item) {
                        source = item.snippet.thumbnails.high.url;

                        return Snippet.create({
                            id: item.id.videoId,
                            title: item.snippet.title,
                            audio: {
                                extension: '.mp3'
                            },
                            thumbnail: {
                                extension: extractExtension(source),
                                source: source
                            },
                            labels: ['youtube']
                        });
                    });

                    if (Ember.isEmpty(response.nextPageToken)) {
                        nextPageToken = null;
                    } else {
                        nextPageToken = response.nextPageToken;
                    }

                    this.set('nextPageToken', nextPageToken);
                    this.set('isLoading', false);

                    save(snippets);
                }.bind(this));
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
