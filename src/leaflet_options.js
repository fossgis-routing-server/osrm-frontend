'use strict';

var L = require('leaflet');
var _localization = require('./localization');
var _links = require('./links');
var _parsedOptions = _links.parse(window.location.search.slice(1));
var _local = _localization.get(_parsedOptions.language);

// translate and check variables
var dataTrans = _local['Data']? _local['Data'] :'Data';
var imageryTrans = _local['Imagery']? _local['Imagery'] :'Imagery';

// set attribution string
var osmAttrImagery = imageryTrans +' © <a rel="license" target="_blank" href="https://www.openstreetmap.org/copyright">'+_local['OpenStreetMap contributors']+'</a>';
var osmAttrData = dataTrans+' © <a rel="license" target="_blank" href="http://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>';

var de = L.tileLayer('//{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    format: 'image/png',
    attribution: osmAttrImagery
  }),
  standard = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    format: 'image/png',
    attribution: osmAttrImagery
  }),

  hiking = L.tileLayer('//tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {}),
  bike = L.tileLayer('//tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {});

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
    path: '/routed-car/route/v1',
    debug: 'car',
  },
  {
    label: 'Bike',
    path: '/routed-bike/route/v1',
    debug: 'bike',
  },
  {
    label: 'Foot',
    path: '/routed-foot/route/v1',
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
