define(function(require) {
    'use strict';

    var Ember = require('ember'),
        stringToColour;

    stringToColour = function(value) {
        var hash = 0,
            index;

        for (index = 0; index < value.length; index++) {
            hash = value.charCodeAt(index) + ((hash << 5) - hash);
            hash = hash & hash;
        }

        return 'hsl(' + hash % 360 + ',60%,60%)';
    };

    return Ember.Component.extend(require('helpers/droppable-mixin'), {
        layoutName: 'label',
        classNames: ['label'],
        classNameBindings: ['label.isSelected:label-success:label-default'],
        attributeBindings: ['style'],
        label: null,
        backgroundColor: function() {
            var name = this.get('label.name');

            return stringToColour(name);
        }.property('label.name'),
        style: function() {
            var isSelected = this.get('label.isSelected'),
                style = '';

            if (isSelected) {
                style = 'background-color: ' + this.get('backgroundColor') + ';';
            }

            return style.htmlSafe();
        }.property('label.isSelected', 'backgroundColor'),
        onDrop: function(event, ui) {
            // TODO: Implement following
            /*ui.helper.data('snippets');*/
        },
        click: function() {
            this.toggleProperty('label.isSelected');

            this.sendAction('action');
        }
    });
});
