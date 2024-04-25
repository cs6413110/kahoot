const ws = require('ws');
const wss = new ws.WebSocketServer({port: 443});
const rooms = {};

const k = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], genId = () => {
  let o = '';
  for (let i = 0; i < 6; i++) o += k[Math.floor(Math.random()*k.length)];
  return o;
}

const getScoreboard = id => {
  let scores = [];
  for (const socket of rooms[id].sockets) if (socket !== rooms[id].host) scores.push([socket.username, socket.score]);
  scores.sort((a, b) => a[1]-b[1]);
  return scores;
}

const getScores = id => {
  let scores = {};
  for (const socket of rooms[id].sockets) scores[socket.username] = socket.score;
  return scores;
}

const gameNewQuestion = id => {
  clearTimeout(rooms[id].timeout);
  rooms[id].question++;
  if (rooms[id].question >= rooms[id].questions.length) {
    rooms[id].host.send({event: 'gameover', scores: getScoreboard(id)});
    for (const socket of rooms[id].sockets) socket.send({event: 'gameover', score: socket.score});
    return;
  }
  let question = rooms[id].questions[rooms[id].question];
  rooms[id].host.send({event: 'question', question: question.question, answers: question.answers});
  rooms[id].questionTimer = setTimeout(() => {
    for (const socket of rooms[id].sockets) if (socket !== rooms[id].host) {
      socket.lastScore = 0;
      socket.answered = false;
      socket.send({event: 'question', question: question.question, answers: question.answers});
    }
  }, 3000);
  rooms[id].timeout = setTimeout(() => {
    rooms[id].host.send({event: 'scoreboard', scores: getScoreboard(id)});
    let scores = getScores(id);
    for (const socket of rooms[id].sockets) if (socket !== rooms[id].host) socket.send({event: 'score', score: socket.score, lastScore: socket.lastScore}); // recent score included too
    rooms[id].timeout = setTimeout(() => gameNewQuestion(id), 5000); // leaderboard phase
  }, Math.max(10000, rooms[id].time || 10000)+3000);
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
          socket.score = 0;
          rooms[data.id].sockets.push(socket);
          const players = getPlayers(data.id);
          for (const s of rooms[data.id].sockets) s.send({event: 'players', names: players});
        } else return socket.send({event: 'error', message: 'Game already started!'});
      } else return socket.send({event: 'error', message: 'Room not found!'});
    } else if (data.event === 'host') {
      const roomId = genId();
      rooms[roomId] = {host: socket, sockets: [socket], questions: data.questions, time: data.time, question: -1, gamestate: 0}; // 0 => joining, 1 => active
      socket.id = roomId;
      socket.send({event: 'code', code: roomId});
    } else if (data.event === 'start') {
      if (socket === rooms[socket.id].host) {
        gameNewQuestion(socket.id);
      }
    } else if (data.event === 'kick') {
      if (socket === rooms[socket.id].host) {
        let s = rooms[socket.id].sockets.find(s => s.username === data.name);
        if (s) s.close();
      }
    } else if (data.event === 'answer') {
      socket.answered = true;
      let room = rooms[socket.id];
      if (!room) return;
      if (data.answer == room.questions[room.question].correct) {
        socket.lastScore = Math.round((1-data.time/room.time)*1000);
      } 
      socket.score += socket.lastScore;
      let allAnswered = true;
      for (const socket of room.sockets) if (room.host !== socket && !socket.answered) allAnswered = false;
      if (allAnswered) {
        room.host.send({event: 'scoreboard', scores: getScoreboard(socket.id)});
        let scores = getScores(socket.id);
        for (const socket of room.sockets) if (socket !== room.host) socket.send({event: 'score', score: socket.score, lastScore: socket.lastScore}); // recent score included too
        clearTimeout(room.timeout);
        room.timeout = setTimeout(() => gameNewQuestion(socket.id), 5000); // leaderboard phase
      }
    }
  });
  socket.on('close', () => {
    if (!socket.id) return;
    if (!rooms[socket.id]) return;
    if (socket === rooms[socket.id].host) {
      for (const s of rooms[socket.id].sockets) s.close();
      clearTimeout(rooms[socket.id].timeout);
      clearTimeout(rooms[socket.id].questionTimeout);
      rooms[socket.id] = undefined;
    } else {
      if (rooms[socket.id].sockets.includes(socket)) rooms[socket.id].sockets.splice(rooms[socket.id].sockets.indexOf(socket), 1);
      if (rooms[socket.id].sockets.length === 0 && rooms[socket.id].gamestate === 1) {
        rooms[socket.id].host.close();
      } else {
        for (const s of rooms[socket.id].sockets) s.send({event: 'players', names: getPlayers(socket.id)});
      }
    }
  });
});
