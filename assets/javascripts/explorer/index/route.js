define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'Index',
        actions: {
            didTransition: function() {
                if (this.get('cache').isMobileConnection()) {
                    this.controller.set('searchOnline', false);
                }

                if (this.controller.get('searchOnline')) {
                    this.controller.scheduleUpdateOnlineSnippets();
                }

                return true;
            }
        }
    });
});
