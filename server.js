
const ws = require('ws');
const wss = new ws.WebSocketServer({port: 443});

const rooms = {};

const k = [0,1,2,3,4,5,6,7,8,9,'a','b','c','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], genId = () => {
  let o = '';
  for (let i = 0; i < 6; i++) o += k[Math.floor(Math.random()*k.length)];
  return o;
}

const gameNewQuestion = id => {
  rooms[id].question++;
  for (const socket of rooms[id].sockets) socket.send({event: 'question', });
}

const getPlayers = id => {
  let o = [];
  for (const s of rooms[id].sockets) if (s.username) o.push(s.username);
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
        if (rooms[data.id].gamestate === 0) {
          for (const s of rooms[data.id].sockets) if (data.username === s.username) return socket.send('That username is already taken for this game!');
          socket.id = data.id;
          socket.username = data.username;
          rooms[data.id].sockets.push(socket);
          const players = getPlayers(data.id);
          for (const s of rooms[data.id].sockets) s.send({event: 'players', amount: players.length, names: players});
        } else return socket.send({event: 'error', message: 'Game already started!'});
      } else return socket.send({event: 'error', message: 'Room not found!'});
    } else if (data.event === 'host') {
      const roomId = genId();
      rooms[roomId] = {host: socket, sockets: [socket], questions: data.questions, time: data.time, question: -1, gamestate: 0}; // 0 => joining, 1 => active
      socket.id = roomId;
      socket.send({event: 'code', code: roomId});
    } else if (data.event === 'start') {
      if (socket === rooms[socket.id].host) { 
        //gameNewQuestion(socket.id);
      }
    } else if (data.event === 'answer') {
      
    }
  });
  socket.on('close', () => {
    if (!socket.id) return;
    if (socket === rooms[socket.id].host) {
      for (const s of rooms[socket.id].sockets) {
        s.send({event: 'error', message: 'Host left the game'});
        s.close();
      }
    } else {
      if (rooms[socket.id].sockets.includes(socket)) rooms[socket.id].splice(rooms[socket.id].indexOf(socket), 1);
      if (rooms[socket.id].sockets.length === 0 && rooms[socket.id].gamestate === 1) {
        rooms[data.id].host.send({event: 'error', message: 'All the players left'});
        rooms[data.id].host.close();
        rooms[data.id] = undefined;
      }
    }
  });
});
