define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        linkToProperties: {
            classNameBindings: ['active:btn-material-amber-A700:btn-default']
        }
    });
});
