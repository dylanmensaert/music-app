define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data');

    return Ember.Controller.extend({
        query: null,
        snippets: null,
        actions: {
            search: function() {
                var url = metaData.searchHost + '/youtube/v3/search?part=snippet&order=viewCount&type=video&videoCategoryId=10';

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
            load: function(snippet) {
                this.get('audio').load(snippet);
            }
        }
    });
});
