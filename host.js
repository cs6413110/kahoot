document.body.innerHTML += `
<title>Kahooty Rip-off</title>
<div id='initial'>
  <button onclick='createGame()'>Host a Game</button>
</div>
<div id='lobby'>
  <div class='hostRoom'>
    <span id='playercount'>0 Players</span> 
    <span id='roomID'>XXXXXX</span>
    <div><button onclick='startGame()'>Start Game</button></div>
  </div>
  <div class='playerDisplay' id='playerlist'></div>
</div>
<div id='q&a'>
  <div class='container'>
    <div class='question' id='QnA'></div>
    <div class='options'>
      <button class='option' id='a'></button>
      <button class='option' id='b'></button>
      <button class='option' id='c'></button>
      <button class='option' id='d'></button>
    </div>
  </div>
</div>
<div id='leaderboard'>
  <div class='score'></div>
</div>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: Verdana;
}
    
/* LeaderBoard */
/* Host Game Button */
#initial {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 5px;
  border-radius: 4px;
}
#initial button {
  color: white;
  background-color: red;
  border: 1px solid red;
  width: 250px;
  font-size: 30px;
}
#initial button:hover {
  background-color: orangered;
  border: 1px solid orangered;
}
    
    
/* Pre-Game Lobby */
.hostRoom {
  width: 100%;
  background-color: red;
  height: 10%;
}
#roomID, #playercount {
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  width: 20%;
}
.hostRoom div {
  display: inline-block;
  text-align: right;
  width: 80%;
}
.hostRoom div button {
  height: 100%;
  background-color: red;
  border: 1px solid red;
  color: white;
  padding-left: 30px;
  padding-right: 30px;
}
.hostRoom div button:hover {
  background-color: orangered;
  border: 1px solid orangered;
}

/* Player Lobby Display For Now. */
.playerDisplay {
  height: 86%;
  width: 96%;
  padding: 2%;
  background-color: #f0f0f0;
}
.player {
  font-size: 20px;
  display: inline-block;
  background-color: #f8f8f8;
  text-align: center;
  padding: 10px;
  margin: 5px;
}
    
/* In-Game Questions 
.container {
  position: relative;
  top: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}*/
.question {
  width: 90%;
  height: 8%;
  text-align: center;
  background-color: red;
  color: white;
  padding-top: 2%;
  padding-right: 5%;
  padding-left: 5%;
}
.options {
  width: 100%;
  height: 90%;
}
.option {
  display: inline-block;
  background-color: #f0f0f0;
  border: none;
  width: 48%;
  height: 48%;
}
#a, #b {
  margin-top: 1%;
  margin-bottom: 1%;
}
#c, #d {
  margin-bottom: 1%;
}
#a, #c {
  margin-left: 1%;
  margin-right: 1%;
}
#c, #d {
  margin-right: 1%;
}
</style>
`;
const initial = document.getElementById('initial');
const lobby = document.getElementById('lobby');
const qna = document.getElementById('q&a');
const leaderboard = document.getElementById('leaderboard');
const k = [initial, lobby, qna, leaderboard], swapMenu = e => {
  for (let i = 0; i < k.length; i++) {
    k[i].style.display = e === i ? 'block' : 'none';
  }
}
swapMenu(0);
window.onerror = alert;
const socket = new WebSocket('ws://141.148.128.231:443'); // connect to server
const game = {};
socket._send = socket.send;
socket.send = m => socket._send(JSON.stringify(m))
socket.onopen = () => alert('Connected to server!');
socket.onmessage = d => {
  alert(d.data);
  const data = JSON.parse(d.data);
  if (data.event === 'code') {
    game.code = data.code;
    document.getElementById('roomID').innerHTML = data.code;
    swapMenu(1)
  } else if (data.event === 'players') {
    const a = data.names.reduce((a, c) => a+`<div class='player' onclick='kick("${c}")'>`+c+'</div>'); // can optimize for styling later
    document.getElementById('playerlist').innerHTML = a;
    document.getElementById('playercount').innerHTML = data.names.length+' Players';
  }
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const createGame = () => socket.send({event: 'host', questions: JSON.parse(prompt('Input JSON data for game: ')), time: Number(prompt('Time per question(in seconds)?'))*1000});
const startGame = () => socket.send({event: 'start'});
const kick = name => {
  alert('kicking '+name);
  socket.send({event: 'kick', name});
}


