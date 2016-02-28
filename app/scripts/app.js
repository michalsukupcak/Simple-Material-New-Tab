(function(document) {
  'use strict';

  /* Grab a reference to App template */
  var app = document.querySelector('#app');

  /**
   * Sets height of <main> element.
   * NOTE: 192px is a static value derived from paper-toolbar.tall height (#mainToolbar).
   */
  app.setMainHeight = function () {
    this.$.content.style.height = window.innerHeight - 192 + 'px';
  };

  /**
   * Opens a link in new tab, link's URL is determined form data-link attribute.
   */
  app.openLink = function (event) {
    chrome.tabs.create({ url: event.currentTarget.dataset.link });
  };

  /**
   * Opens new Chrome window (incognito is determined from string value in data-incognito attribute).
   */
  app.openNewWindow = function () {
    chrome.windows.create({ url: 'chrome://newtab', incognito: (event.currentTarget.dataset.incognito === 'true') });
  };

  /**
   * Opens "Customize" dialog.
   */
  app.openCustomizeDialog = function () {
    this.$.customizeDialog.open();
  };

  /**
   * Opens "About" dialog.
   */
  app.openAboutDialog = function () {
    this.$.aboutDialog.open();
  };

  /**
   * Listen for template bound event to know when bindings have resolved and content has been stamped to the page.
   */
  app.addEventListener('dom-change', function () {
    this.setMainHeight();
  });

  /**
   * Recalculate height of <main> element when window is resized.
   */
  window.onresize = function () {
    app.setMainHeight();
  };

  /**
   * this.__shortcuts is undefined in localstorage, set default values (enable all by default).
   */
  app.__shortcutsEmpty = function () {
    this.__shortcuts = {
      apps: true,
      bookmarks: true,
      downloads: true,
      history: true,
      extensions: true,
      flags: true
    }
  };

  /**
   * this.__themeColor value loaded from localstorage.
   */
  app.__themeColorLoaded = function () {
    this.applyThemeColor(this.__themeColor);
    this.removeFabChecks();
    document.querySelector('paper-fab[data-theme="' + this.__themeColor + '"]').icon = 'check';
  };

  /**
   * If this.__themeColor is undefined in localstorage, set default theme (grey).
   */
  app.__themeColorEmpty = function () {
    this.applyThemeColor('grey');
  };

  /**
   * Change theme color from click on FAB button.
   */
  app.changeThemeColor = function (event) {
    var theme = Polymer.dom(event).localTarget.dataset.theme;
    this.applyThemeColor(theme);
    this.__themeColor = theme;
    this.removeFabChecks();
    Polymer.dom(event).localTarget.icon = 'check';
  };

  /**
   * Apply theme color to all necessary UI components.
   */
  app.applyThemeColor = function (theme) {
    var color = 'var(--color-' + theme + ')';
    this.$.mainToolbar.customStyle['--primary-color'] = color;
    var dialogs = document.querySelectorAll('paper-dialog');
    for (var i in dialogs) {
      if (dialogs.hasOwnProperty(i)) {
        dialogs[i].customStyle['--paper-dialog-button-color'] = color;
      }
    }
    var checkboxes = document.querySelectorAll('paper-checkbox');
    for (var i in checkboxes) {
      if (checkboxes.hasOwnProperty(i)) {
        checkboxes[i].customStyle['--paper-checkbox-checked-color'] = color;
        checkboxes[i].customStyle['--paper-checkbox-checked-ink-color'] = color;
      }
    }
    var toggles = document.querySelectorAll('paper-toggle-button');
    for (var i in toggles) {
      if (toggles.hasOwnProperty(i)) {
        toggles[i].customStyle['--paper-toggle-button-checked-bar-color'] = color;
        toggles[i].customStyle['--paper-toggle-button-checked-button-color'] = color;
        toggles[i].customStyle['--paper-toggle-button-checked-ink-color'] = color;
      }
    }
    var cards = document.querySelectorAll('x-bookmarks, x-apps');
    for (var i in cards) {
      if (cards.hasOwnProperty(i)) {
        cards[i].customStyle['--card-header-color'] = color;
      }
    }
    Polymer.updateStyles();
  };

  /**
   * Removes check marks (icons) from mini FAB buttons.
   */
  app.removeFabChecks = function () {
    var fabs = document.querySelectorAll('paper-fab[mini]');
    for (var i in fabs) {
      if (fabs.hasOwnProperty(i)) {
        fabs[i].icon = '';
      }
    }
  };

})(document);
