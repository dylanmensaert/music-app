define(function() {
    'use strict';

    return {
        isMatch: function(value, other) {
            return value.toLowerCase().includes(other.toLowerCase());
        }
    };
});
