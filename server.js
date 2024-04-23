
const ws = require('ws');
const wss = new ws.WebSocketServer({port: 8000});

const rooms = {};

wss.on('connection', socket => {
  socket.on('message', data => {
    socket.send(data);
    if (data.event === 'join') {
      
    } else if (data.event === 'host') {
      
    } else if (data.event === 'answer') {
      
    }
  });
});
