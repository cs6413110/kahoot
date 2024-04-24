
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
    if (data.event === 'join') {
      if (rooms[data.id]) {
        // join
        socket.id = data.id;
      } else return socket.send({event: 'error', message: 'Room not found!'});
    } else if (data.event === 'host') {
      const roomId = genId();
      rooms[roomId] = {host: socket, sockets: [socket], questions: data.questions, time: data.time, question: -1};
      socket.id = roomId;
      socket.send({event: 'code', code: roomId});
    } else if (data.event === 'start') {
      
    } else if (data.event === 'answer') {
      // format of {event: 'answer', id: <roomid>, answer: 0-3}
      
    }
  });
});
