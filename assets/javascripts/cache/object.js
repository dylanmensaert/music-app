define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Object.extend({
        init: function() {
            this._super();
        },
        selectedSnippets: [],
        playedSnippetIds: [],
        showMessage: null,
        slider: null,
        isMobileConnection: function() {
            var type,
                isMobileConnection = false;

            if (!Ember.isEmpty(navigator.connection)) {
                type = navigator.connection.type;

                isMobileConnection = type === Connection.CELL_2G || type === Connection.CELL_3G || type === Connection.CELL_4G || type ===
                    Connection.CELL;
            }

            return isMobileConnection;
        }
    });
});
