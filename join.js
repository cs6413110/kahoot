document.body.innerHTML += `
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
  <button id='a' class='answer'>a</button>
  <button id='b' class='answer'>b</button>
  <button id='c' class='answer'>c</button>
  <button id='d' class='answer'>d</button>
</div>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: Verdana;
}
#join, #waiting, #question {
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
</style>
`;
const join = document.getElementById('join');
const wait = document.getElementById('waiting');
const question = document.getElementById('question');
const k = [join, wait, question], swapMenu = e => {
  for (let i = 0; i < k.length; i++) {
    k[i].style.display = e === i ? 'block' : 'none';
  }
}
swapMenu(0);
const socket = new WebSocket('ws://141.148.128.231:443'); // connect to server
const game = {};
socket._send = socket.send;
socket.send = m => socket._send(JSON.stringify(m))
socket.onopen = () => alert('Connected to server!');
socket.onmessage = d => {
  alert(d.data);
  const data = JSON.parse(d.data);
  if (data.event === 'players') {
    swapMenu(1);
  }
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const joinGame = () => {
  game.username = document.getElementById('username').value;
  game.code = document.getElementById('code').value;
  socket.send({event: 'join', username: game.username, id: game.code}); 
}
