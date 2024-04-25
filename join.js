document.body.innerHTML += `
<div id='join'>
  <input id='username' placeholder='username' /><br>
  <input id='code' placeholder='room code' /><br>
  <button onclick='joinGame()'>Join</button>
</div>
<div id='waiting'>
  <h1>Waiting for other players</h1>
</div>
<div id='question'>
  <button>a</button>
  <button>b</button>
  <button>c</button>
  <button>d</button>
</div>
<style>
body {
  margin: 0px;
  padding: 0px;
}
#join, #waiting {
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  text-align: center;
}
#join button {
  color: white;
  border: none;
  background-color: powderblue;
  font-size: 20px;
}
#join div button:hover {
  background-color: blue;
}
#join input {
  width: 200px;
  font-size: 20px;
  font-family: Verdana;
  border: 1px solid black;
}
#waiting h1 {
  font-size: 100%;
}
</style>
`;
const join = document.getElementById('join');
const wait = document.getElementById('waiting');
const question = document.getElementById('question');
const k = [join, wait, question], swapMenu = e => {
  for (let i = 0; i < k.length; i++) {
    k[i].style.visibility = e === i ? 'visible' : 'hidden';
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
