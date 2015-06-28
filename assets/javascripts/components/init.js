define(function(require) {
    'use strict';

    var App = require('init/app');

    App.SuggestInputComponent = require('components/suggest-input');
    App.FileInputComponent = require('components/file-input');
    App.ClearAddonComponent = require('clear-addon/component');
    App.AppLabelComponent = require('label/component');
    App.AppSnippetComponent = require('snippet/component');
    App.ActionBarComponent = require('action-bar/component');
    App.MessageBarComponent = require('message-bar/component');
    App.MenuIconComponent = require('menu-icon/component');
});
