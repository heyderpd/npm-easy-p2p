# EASY P2P 
Simple and easy use of p2p from [npm~peerjs](https://www.npmjs.com/package/peerjs)

To create a key access [peerjs.com](http://peerjs.com/peerserver)

Example of Mult Mask:
```javascript
import peerConnection from 'easy-p2p'

const peer = new peerConnection('your-peerjs-developer-key')
```

Host:
```javascript
const onReceiveData = msg => console.log('msg:', msg)

conn
  .host()
  .setOnData(onReceiveData)

const peerId = conn.getId()

conn.send('server: test-msg')
```

Join:
```javascript
conn
  .join(peerId)
  .setOnData(onReceiveData)
  .send('client: test-msg')
```
