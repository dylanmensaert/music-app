define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        linkToProperties: {
            classNameBindings: ['active:btn-primary:btn-default']
        }
    });
});
