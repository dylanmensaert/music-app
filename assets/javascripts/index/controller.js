define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data');

    return Ember.Controller.extend({
        query: '',
        snippets: null,
        musicOnly: true,
        search: function() {
            var url = metaData.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video';

            // TODO: implement in settings page?
            if (this.get('musicOnly')) {
                url += '&videoCategoryId=10';
            }

            url += '&key=' + metaData.key;
            url += '&q=' + this.get('query');

            // TODO: url += '&relatedToVideoId=' + this.get('videoId');

            Ember.$.getJSON(url).then(function(response) {
                var snippets = response.items.map(function(item) {
                    return Ember.Object.create({
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.high.url
                    });
                });

                this.set('snippets', snippets);
            }.bind(this));
        },
        actions: {
            search: function() {
                this.search();
            },
            // TODO: set class 'active' on currently playing
            load: function(snippet) {
                this.get('audio').load(snippet);
            },
            clear: function() {
                this.set('query', '');
            },
            toggleMusicOnly: function() {
                this.toggleProperty('musicOnly');

                this.search();
            }
        }
    });
});
