define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.LinkView.extend({
        tagName: 'div',
        className: 'btn',
        classNameBindings: ['active:btn-primary']
    });
});
