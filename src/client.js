/* Example from https://bl.ocks.org/adammw/d9bf021c395835427aa0 */

import Peer from 'simple-peer';
import io from 'socket.io-client';

var urlServer = 'https://simple-peer-server.herokuapp.com:3000'
var socket = io.connect(urlServer);
var peers = {};
var useTrickle = true;

socket.on('connect', function() {
  console.log('Connected to signalling server, Peer ID: %s', socket.id);
});

socket.on('peer', function(data) {
  console.log('socket')

  var peerId = data.peerId;
  var peer = new Peer({ initiator: data.initiator, trickle: useTrickle });

  console.log('Peer available for connection discovered from signalling server, Peer ID: %s', peerId);

  socket.on('signal', function(data) {
    if (data.peerId == peerId) {
      console.log('Received signalling data', data, 'from Peer ID:', peerId);
      peer.signal(data.signal);
    }
  });

  peer.on('signal', function(data) {
    console.log('Advertising signalling data', data, 'to Peer ID:', peerId);
    socket.emit('signal', {
      signal: data,
      peerId: peerId
    });
  });
  peer.on('error', function(e) {
    console.log('Error sending connection to peer %s:', peerId, e);
  });
  peer.on('connect', function() {
    console.log('Peer connection established');
    peer.send("hey peer");
  });
  peer.on('data', function(data) {
    console.log('Recieved data from peer:', data);
  });
  peers[peerId] = peer;
});

function send (msg) {
  console.log('*** msg', peers, msg)
  var r = Math.random()
  Object.keys(peers)
    .map(key => {
      var p = peers[key]
      console.log('*** p, p.send', p, p.send)
      if (p && p.send) {
        p.send(msg)
      }
    })
  console.log('*** end xabla')
}

export default send
