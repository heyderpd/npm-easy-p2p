import Peer from 'peerjs'
import randomstring from 'randomstring'

const peerConnection = key => {
  const state = {
    peer: null,
    connection: null,
    onData: null,
    opened: false,
    host: false,
    join: false
  }

  const _setHost = () => {
    state.host = true
    state.join = false
  }

  const _setJoin = () => {
    state.host = false
    state.join = true
  }

  const _initialize = key => {
    state.peer = new Peer(randomstring.generate(5), { key })
  }

  const _safeOnData = data => {
    if (typeof(state.onData) === 'function') {
      state.onData(data)
    }
  }

  const _sendError = (title, msg) => {
    const error = { title, msg }
    console.error(error)
    _safeOnData({ error })
  }

  const _onOpen = info => {
    _sendError('on.open', info)
    state.opened = true
  }

  const _onClose = info => {
    _sendError('on.close', info)
    state.opened = false
  }

  const _onError = error => {
    _sendError('on.error', error)
    state.opened = false
  }

  const _onConnection = conn => {
    state.connection = conn
    state.peer.on('open', _onOpen)
    state.peer.on('close', _onClose)
    state.peer.on('error', _onError)
    conn.on('data', _safeOnData)
  }

  const object = {}

  object.host = () => {
    try {
      _setHost()
      state.peer.on('connection', _onConnection)

    } catch (error) {
      _sendError("can't host", error)
    }
    return object
  }

  object.join = id => {
    try {
      _setJoin()
      const conn = state.peer.connect(id)
      _onConnection(conn)

    } catch (error) {
      _sendError("can't join", error)
    }
    return object
  }

  object.getId = () => state.peer.id

  object.isHost = () => state.host

  object.isJoin = () => state.join

  object.setOnData = onData => {
    state.onData = onData
    return object
  }

  object.send = data => {
    state.connection.send(data)
    return object
  }

  _initialize(key)

  return object
}

export default peerConnection