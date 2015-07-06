define(function(require) {
    'use strict';

    var App = require('init/app');

    App.SuggestInputComponent = require('components/suggest-input');
    App.SuggestInputGroupComponent = require('suggest-input-group/component');
    App.FileInputComponent = require('components/file-input');
    App.AppLabelComponent = require('label/component');
    App.AppSnippetComponent = require('snippet/component');
    App.ActionBarComponent = require('action-bar/component');
    App.MessageBarComponent = require('message-bar/component');
    App.SnippetActionBarComponent = require('snippet/action-bar/component');
});
