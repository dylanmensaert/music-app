define(function() {
    'use strict';

    var formatSearch = function(value) {
        return value.toLowerCase().replace(/\s/g, '');
    };

    return {
        includes: function(value, other) {
            return formatSearch(value).includes(formatSearch(other));
        }
    };
});
