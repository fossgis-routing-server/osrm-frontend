'use strict';

var L = require('leaflet');

var de = L.tileLayer('//{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    attribution: '<a target="_blank" href="http://www.openstreetmap.org/">Karte hergestellt aus OpenStreetMap-Daten</a> | Lizenz: <a rel="license" target="_blank" href="http://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>'
  }),
  standard = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="/copyright">OpenStreetMap contributors</a>'
  }),

  hiking = L.tileLayer('//tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {}),
  bike = L.tileLayer('//tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {})

module.exports = {
  defaultState: {
    center: L.latLng(50, 12),
    zoom: 7,
    waypoints: [],
    language: 'en',
    alternative: 0,
    layer: de,
    service: 1
  },
  services: [{
    label: 'Car',
    path: 'https://routing.openstreetmap.de/routed-car/route/v1',
    debug: 'car',
  },
  {
    label: 'Bike',
    path: 'https://routing.openstreetmap.de/routed-bike/route/v1',
    debug: 'bike',
  },
  {
    label: 'Foot',
    path: 'https://routing.openstreetmap.de/routed-foot/route/v1',
    debug: 'foot',
  }],
  layer: [{
    'openstreetmap.de': de,
    'openstreetmap.org': standard,
  }],
  overlay: {
    'hiking': hiking,
    'bike': bike,
  },
  baselayer: {
    one: standard,
  }
};
