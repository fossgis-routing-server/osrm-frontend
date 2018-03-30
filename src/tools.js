'use strict';

var L = require('leaflet');
var shortlink = require('./shortlink');

var Control = L.Control.extend({
  includes: L.Mixin.Events,
  options: {
    toolContainerClass: "",
    editorButtonClass: "",
    josmButtonClass: "",
    debugButtonClass: "",
    mapillaryButtonClass: "",
    shareButtonClass: "",
    localizationChooserClass: ""
  },

  initialize: function(localization, languages, options) {
    L.setOptions(this, options);
    this._local = localization;
    this._languages = languages;
  },

  onAdd: function(map) {
    var editorContainer,
      editorButton,
      josmContainer,
      josmButton,
      debugContainer,
      debugButton,
      mapillaryContainer,
      mapillaryButton,
      shareContainer,
      shareButton,
      localizationButton,
      popupCloseButton,
      gpxContainer;
    this._container = L.DomUtil.create('div', 'leaflet-osrm-tools-container ' + this.options.toolsContainerClass);
    L.DomEvent.disableClickPropagation(this._container);
    editorContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-editor', this._container);
    editorButton = L.DomUtil.create('span', this.options.editorButtonClass, editorContainer);
    editorButton.title = this._local['Open in editor'];
    L.DomEvent.on(editorButton, 'click', this._openEditor, this);
    josmContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-josm', this._container);
    josmButton = L.DomUtil.create('span', this.options.josmButtonClass, josmContainer);
    josmButton.title = this._local['Open in JOSM'];
    L.DomEvent.on(josmButton, 'click', this._openJOSM, this);
    debugContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-debug', this._container);
    debugButton = L.DomUtil.create('span', this.options.debugButtonClass, debugContainer);
    debugButton.title = this._local['Open in Debug Map'];
    L.DomEvent.on(debugButton, 'click', this._openDebug, this);
    mapillaryContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-mapillary', this._container);
    mapillaryButton = L.DomUtil.create('span', this.options.mapillaryButtonClass, mapillaryContainer);
    mapillaryButton.title = this._local['Open in Mapillary'];
    L.DomEvent.on(mapillaryButton, 'click', this._openMapillary, this);
    shareContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-share', this._container);
    this._shareButton = L.DomUtil.create('span', this.options.shareButtonClass, shareContainer);
    this._sharePopup = L.DomUtil.create('div', 'leaflet-osrm-tools-container share-popup', this._shareButton);
    this._shareButton.title = this._local['Share Route'];
    L.DomEvent.on(this._shareButton, 'click', this._showSharePopup, this);
    this._localizationContainer = L.DomUtil.create('div', 'leaflet-osrm-tools-localization', this._container);
    this._createLocalizationList(this._localizationContainer);
    return this._container;
  },

  onRemove: function() {},

  _openEditor: function() {
    var position = this._map.getCenter(),
      zoom = this._map.getZoom(),
      prec = 6;
    window.open("https://www.openstreetmap.org/edit?lat=" + position.lat.toFixed(prec) + "&lon=" + position.lng.toFixed(prec) + "&zoom=" + zoom);
  },

  _openJOSM: function() {
    var bounds = this._map.getBounds(),
      url = 'http://127.0.0.1:8111/load_and_zoom' +
      '?left=' + bounds.getWest() +
      '&right=' + bounds.getEast() +
      '&bottom=' + bounds.getSouth() +
      '&top=' + bounds.getNorth();
    window.open(url);
  },

  _openDebug: function() {
    var position = this._map.getCenter(),
      zoom = this._map.getZoom(),
      prec = 6;
    window.open("https://routing.osm.ch/debug/" + this.profile.debug + ".html#" + zoom + "/" + position.lat.toFixed(prec) + "/" + position.lng.toFixed(prec));
  },

  setProfile: function(profile) {
    this.profile = profile;
  },

  _openMapillary: function() {
    var position = this._map.getCenter(),
      zoom = this._map.getZoom(),
      prec = 6;
    window.open("https://www.mapillary.com/app/?lat=" + position.lat.toFixed(prec) + "&lng=" + position.lng.toFixed(prec) + "&z=" + zoom);
  },

  _showSharePopup: function() {
    L.DomUtil.addClass(this._shareButton, 'share-popup-visible');
    var overlay = L.DomUtil.create('div', 'share-overlay', this._sharePopup);
    L.DomEvent.on(overlay, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      this._hideSharePopup();
    }, this);
    var container = L.DomUtil.create('div', 'share-container', this._sharePopup);
    L.DomEvent.on(container, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
    });
    var typeButtonContainer = L.DomUtil.create('div', 'share-type-button-container', container);
    var linkButton = L.DomUtil.create('button', 'share-type', typeButtonContainer);
    linkButton.textContent = this._local['Link'];
    var shortLinkButton = L.DomUtil.create('button', 'share-type selected', typeButtonContainer);
    shortLinkButton.textContent = this._local['Shortlink'];
    var input = L.DomUtil.create('input', 'share-url', container);
    var url = window.document.location.href;
    shortlink.osmli(url, L.Util.bind(function (shortLink) {
      this._shortLink = shortLink;
      input.value = this._shortLink;
      input.select();
    }, this));

    L.DomEvent.on(linkButton, 'click', function () {
      if (!L.DomUtil.hasClass(linkButton, 'selected')) {
        L.DomUtil.addClass(linkButton, 'selected');
        L.DomUtil.removeClass(shortLinkButton, 'selected');
        input.value = window.document.location.href;
        input.select();
      }
    });
    L.DomEvent.on(shortLinkButton, 'click', function () {
      if (!L.DomUtil.hasClass(shortLinkButton, 'selected')) {
        L.DomUtil.addClass(shortLinkButton, 'selected');
        L.DomUtil.removeClass(linkButton, 'selected');
        if (! this._shortLink) {
          var url = window.document.location.href;
          shortlink.osmli(url, L.Util.bind(function (shortLink) {
            this._shortLink = shortLink;
            input.value = this._shortLink;
            input.select();
          }, this));
        }
        else {
          input.value = this._shortLink;
          input.select();
        }
      }
    }, this);
  },

  _hideSharePopup: function() {
      this._shortLink = null;
      L.DomUtil.removeClass(this._shareButton, 'share-popup-visible');
      while (this._sharePopup.lastChild) {
        this._sharePopup.removeChild(this._sharePopup.lastChild);
      }
  },

  _updatePopupPosition: function(button) {
    var rect = this._container.getBoundingClientRect(),
        left = 0;
    if (button)
    {
        left = button.getBoundingClientRect().left - rect.left;
    }
    this._popupWindow.style.position = 'absolute';
    this._popupWindow.style.left = left + 'px';
    this._popupWindow.style.bottom = rect.height + 'px';
  },

  _createLocalizationList: function(container) {
    var _this = this;
    var localizationSelect = L.DomUtil.create('select', _this.options.localizationChooserClass, container);
    localizationSelect.setAttribute('title', _this._local['Select language']);
    L.DomEvent.on(localizationSelect, 'change', function(event) {
        this.fire('languagechanged', {
            language: event.target.value
        });
    }, _this);
    Object.keys(this._languages).forEach(function(key) {
        var option = L.DomUtil.create('option', 'fill-osrm', localizationSelect);
        option.setAttribute('value', key);
        option.appendChild(
            document.createTextNode(_this._languages[key])
        );
        if (key == _this._local.key)
        {
            option.setAttribute('selected', '');
        }
    });
  }
});

module.exports = {
  control: function(localization, languages, options) {
    return new Control(localization, languages, options);
  }
};
