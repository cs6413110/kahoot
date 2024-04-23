
const ws = require('ws');
const wss = new ws.WebSocketServer({port: 443});

const rooms = {};

const k = [0,1,2,3,4,5,6,7,8,9,'a','b','c','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], genId = () => {
  let o = '';
  for (let i = 0; i < 6; i++) o += k[Math.floor(Math.random()*k.length)];
  return o;
}

wss.on('connection', socket => {
  socket._send = socket.send;
  socket.send = d => socket._send(JSON.stringify(d));
  socket.on('message', data => {
    try {
      data = JSON.parse(data);
    } catch(e) {
      console.log('Invalid data: '+data);
      socket.send({event: 'error', message: 'Invalid Data!'});
    }
    socket.send(data);
    if (data.event === 'join') {
      
    } else if (data.event === 'host') {
      const roomId = genId();
      rooms[roomId] = {host: socket, sockets: [], questions: data.questions, time: data.time};
      socket.send({event: 'code', code: roomId});
    } else if (data.event === 'answer') {
      
    }
  });
});
