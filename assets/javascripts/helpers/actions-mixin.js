define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        liveQuery: '',
        query: '',
        selected: null,
        originals: null,
        isEditMode: false,
        editPlaceholder: null,
        actions: {
            search: function() {
                this.set('query', this.get('liveQuery'));
            },
            remove: function() {
                var originals = this.get('originals');

                this.get('selected').forEach(function(model) {
                    originals.removeObject(model);
                });
            },
            setupEdit: function() {
                var name = this.get('selected.firstObject.name');

                this.set('liveQuery', name);
                this.set('editPlaceholder', 'Edit: ' + name);
                this.set('isEditMode', true)
            },
            saveEdit: function() {
                this.set('selected.firstObject.name', this.get('liveQuery'));

                this.send('exitEdit');
            },
            exitEdit: function() {
                this.set('liveQuery', '');
                this.set('isEditMode', false);
            }
        }
    });
});
