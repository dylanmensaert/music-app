define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Route.extend(require('helpers/update-title'), {
        title: 'Index',
        setupController: function(controller, model) {
            if (this.get('cache').isMobileConnection()) {
                controller.set('searchOnline', false);
            }

            this._super(controller, model);
        }
    });
});
