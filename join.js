document.body.innerHTML += `
<div id='stats'>
  <p id='name'></p>
  <strong id='score'></strong>
</div>
<div id='join'>
  <div id='center'>
    <input id='username' placeholder='username' /><br>
    <input id='code' placeholder='room code' /><br>
    <button onclick='joinGame()'>Join</button>
  </div>
</div>
<div id='waiting'>
  <h1>Waiting for other players</h1>
</div>
<div id='question'>
  <button id='a' class='answer' onclick='answer(0)'>a</button>
  <button id='b' class='answer' onclick='answer(1)'>b</button>
  <button id='c' class='answer' onclick='answer(2)'>c</button>
  <button id='d' class='answer' onclick='answer(3)'>d</button>
</div>
<div id='status'>
  <p id='points'></p>
</div>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: Verdana;
}
#stats {
  position: absolute;
  top: 0px;
  right 0px;
}
#stats * {
  display: inline-block;
}
#join, #waiting, #question, #status {
  width: 100%;
  height: 100%;
  text-align: center;
}
#center {
  position: absolute;
  width: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#join div button {
  background-color: blue;
  color: white;
  width: 150px;
  font-size: 15px;
  border: 1px solid blue;
}
#join div input {
  margin-bottom: 10px;
  width: 150px;
  font-size: 15px;
}
#waiting h1 {
  font-size: 300%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#a, #b {
  margin-top: 3%;
  margin-bottom: 1.5%;
}
#c, #d {
  margin-bottom: 3%;
  margin-top: 1.5%;
}
#a, #c {
  margin-left: 3%;
  margin-right: 1.5%;
}
#b, #d {
  margin-right: 3%;
  margin-right: 1.5%;
}
.answer {
  width: 45.5%;
  height: 45.5%;
  display: inline-block;
  padding: 0;
}
#points {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
`;
const join = document.getElementById('join');
const wait = document.getElementById('waiting');
const question = document.getElementById('question');
const status = document.getElementById('status');
const k = [join, wait, question, status], swapMenu = e => {
  for (let i = 0; i < k.length; i++) {
    k[i].style.display = e === i ? 'block' : 'none';
  }
}
swapMenu(0);
const socket = new WebSocket('ws://141.148.128.231:443'); // connect to server
const game = {};
socket._send = socket.send;
socket.send = m => socket._send(JSON.stringify(m))
socket.onmessage = d => {
  const data = JSON.parse(d.data);
  if (data.event === 'players') {
    swapMenu(1);
  } else if (data.event === 'question') {
    swapMenu(2);
    for (let i = 0; i < 4; i++) document.getElementById(['a', 'b', 'c', 'd'][i]).innerHTML = data.answers[i];
    game.questionStart = Date.now();
  } else if (data.event === 'score') {
    swapMenu(3);
    status.style.backgroundColor = data.lastScore === 0 ? 'red' : 'green';
    document.getElementById('points').innerHTML = '+'+data.lastScore+' points';
    document.getElementById('score').innerHTML = data.score+' points';
  } else if (data.event === 'error') alert(data.message);
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const answer = i => {
  socket.send({event: 'answer', answer: i, time: Date.now()-game.questionStart});
  swapMenu(1);
}

const joinGame = () => {
  document.getElementById('name').innerHTML = game.username = document.getElementById('username').value;
  game.code = document.getElementById('code').value;
  socket.send({event: 'join', username: game.username, id: game.code}); 
}
