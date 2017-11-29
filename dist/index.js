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

  var _sendPacket = function _sendPacket(actionType) {
    return function (title, msg) {
      var action = 'easy-p2p:' + actionType;
      var payload = { title: title, msg: msg };
      var packet = { action: action, payload: payload };
      console.warn(packet);
      _safeOnData(packet);
    };
  };

  var _sendInfo = _sendPacket('info');

  var _sendError = _sendPacket('error');

  var _onOpen = function _onOpen(info) {
    _sendInfo('on.open', info);
    state.opened = true;
  };

  var _onClose = function _onClose(info) {
    _sendInfo('on.close', info);
    state.opened = false;
  };

  var _onError = function _onError(error) {
    _sendError('on.error', error);
    state.opened = false;
  };

  var _onConnection = function _onConnection(conn) {
    try {
      _sendInfo('on.connection', { id: conn.peer });
      state.connection = conn;
      state.peer.on('open', _onOpen);
      state.peer.on('close', _onClose);
      state.peer.on('error', _onError);
      conn.on('data', _safeOnData);
    } catch (error) {
      _sendError("can't connection", error);
    }
  };

  var object = {};

  object.host = function () {
    try {
      _setHost();
      state.peer.on('connection', _onConnection);
      _sendInfo('host, success');
    } catch (error) {
      _sendError("can't host", error);
    }
    return object;
  };

  object.join = function (id) {
    try {
      _setJoin();
      var conn = state.peer.connect(id);
      _onConnection(conn);
      _sendInfo('join, success');
    } catch (error) {
      _sendError("can't join", error);
    }
    return object;
  };

  object.abort = function () {
    try {
      state.host = false;
      state.join = false;
      state.peer.destroy();
      _sendInfo('abort, success');
    } catch (error) {
      _sendError("can't abort", error);
    }
    return object;
  };

  object.getId = function () {
    return state.peer.id;
  };

  object.isHost = function () {
    return state.host;
  };

  object.isJoin = function () {
    return state.join;
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