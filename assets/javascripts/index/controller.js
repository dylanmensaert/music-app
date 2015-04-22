define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data');

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        nextPageToken: null,
        search: function(url, save) {
            var snippets;

            Ember.$.getJSON(url).then(function(response) {
                snippets = response.items.map(function(item) {
                    return Ember.Object.create({
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.high.url
                    });
                });

                this.set('nextPageToken', response.nextPageToken);

                save(snippets);
            }.bind(this));
        },
        searchUrl: function() {
            var url = metaData.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=50';
            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            // TODO: implement in settings page?
            if (this.get('session.model.musicOnly')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + metaData.key;
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

                this.set('nextPageToken', null);

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
