'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _peerjs = require('peerjs');

var _peerjs2 = _interopRequireDefault(_peerjs);

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var peerConnection = function peerConnection(key) {
  var state = {
    peer: null,
    connection: null,
    onData: null,
    opened: false,
    host: false,
    join: false
  };

  var _onOpen = function _onOpen() {
    state.opened = true;
  };

  var _onClose = function _onClose() {
    state.opened = false;
  };

  var _setHost = function _setHost() {
    state.host = true;
    state.join = false;
  };

  var _setJoin = function _setJoin() {
    state.host = false;
    state.join = true;
  };

  var _initialize = function _initialize(key) {
    state.peer = new _peerjs2.default(_randomstring2.default.generate(5), { key: key });
  };

  var _safeOnData = function _safeOnData(data) {
    if (typeof state.onData === 'function') {
      state.onData(data);
    }
  };

  var _onConnection = function _onConnection(conn) {
    state.connection = conn;
    state.peer.on('open', _onOpen);
    state.peer.on('close', _onClose);
    state.peer.on('error', function (err) {
      return _onClose(), console.log('-*-error', err);
    });
    conn.on('data', _safeOnData);
  };

  var object = {};

  object.host = function () {
    _setHost();
    state.peer.on('connection', _onConnection);
    return object;
  };

  object.join = function (id) {
    _setJoin();
    var conn = state.peer.connect(id);
    _onConnection(conn);
    return object;
  };

  object.getId = function () {
    return state.peer.id;
  };

  object.setOnData = function (onData) {
    state.onData = onData;
    return object;
  };

  object.send = function (data) {
    state.connection.send(data);
    return object;
  };

  _initialize(key);

  return object;
};

exports.default = peerConnection;