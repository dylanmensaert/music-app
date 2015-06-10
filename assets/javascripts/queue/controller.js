define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Controller.extend({
        'droppable-component': require('my-droppable/component')
    });
});
