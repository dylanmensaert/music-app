define(function(require) {
    'use strict';

    var App = require('init/app');

    App.FocusInputComponent = require('components/focus-input');
    App.SuggestInputComponent = require('components/suggest-input');
    App.FileInputComponent = require('components/file-input');
    App.ClearAddonComponent = require('clear-addon/component');
    App.LinkLiComponent = require('components/link-li');
    App.AppLabelComponent = require('label/component');
    App.AppSnippetComponent = require('snippet/component');
    App.ActionBarComponent = require('action-bar/component');
});
