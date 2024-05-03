document.body.innerHTML += `
<title>Coolhoot</title>
<div id='initial'>
  <button onclick='createGame()' class="hover pointer">Host a Game</button>
</div>
<div id='lobby'>
  <div class='hostRoom'>
    <span id='playercount'>0 Players</span> 
    <span id='roomID'>XXXXXX</span>
    <div onclick='startGame()' class="pointer start">Start Game</div>
  </div>
  <div class="line"></div>
  <div class='playerDisplay' id='playerlist'></div>
</div>
<div id='q&a'>
  <div class='container'>
    <div class='question'><button id='QnA'></button></div>
    <div class='options'>
      <button class='option' id='a'></button>
      <button class='option' id='b'></button>
      <button class='option' id='c'></button>
      <button class='option' id='d'></button>
    </div>
  </div>
</div>
<div id='leaderboard'>
  <div class="exitbutton">End Game</div>
  <div class='score'></div>
</div>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: Verdana;
}
    
/* LeaderBoard */
#roomID {
  font-size: 250%;
}
.start {
  width: 100%;
}
.start:hover {
  cursor: pointer;
  background-color: purple;
}
.exitbutton {
  position: absolute;
  top: 0;
  text-align: center;
  align-content: center;
  font-size: 300%;
  justify-content: center;
  width: 100%;
  height: 15%;
  background-color: red;
}
.exitbutton:hover {
  cursor: cell;
  background-color: lightred;
}
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
.pointer:hover{cursor: pointer;}
.hover:hover{transform: scale(1.2); transition: transform .1s ease-in-out;}
.hostRoom {
  width: 100%;
  background-color: red;
  height: 20%;
}
#roomID, #playercount {
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  verticle-align: center;
  height: 100%;
  width: 100%;
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
  background-color: #ee90906e;
  text-align: center;
  padding: 10px;
  margin: 5px;
}
.player:hover {
  transform: scale(1.07);
  transition: transform 0.1s ease-in-out;
  cursor: pointer;
  text-decoration: line-through;
  
}
.line {
  display: none; /* idk what this is??? it was just adding x overflow so turned it off */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  transform: rotate(-45deg);
  transform-origin: top left;
  transition: transform 0.3s;
  pointer-events: none;
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
  height: 18%;
  text-align: center;
  background-color: red;
  color: white;
  padding-right: 5%;
  padding-left: 5%;
}
#QnA {
  height: 100%;
  font-size: 30px;
  border: none;
  margin: 0;
  padding: 0;
  color: white;
  background-color: red;
}
.options {
  width: 100%;
  height: 80%;
}
.option {
  display: inline-block;
  background-color: #f0f0f0;
  border: none;
  box-shadow: .1px .1px 20px .1px rgba(1, 1, 1, 1);
  width: 48%;
  height: 48%;
}
#a{background-color:red;color:#fff;}
#b{background-color:blue;color:#fff;}
#c{background-color:orange;color:#fff;}
#d{background-color:green;color:#fff;}
#a, #b, #c, #d:hover{
  cursor: pointer;
} 
#a, #b, #c, #d {
  font-size: 200%;
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
const l = new Audio('https://raw.githubusercontent.com/cs6413110/kahoot/main/lobby.mp3');
const q = new Audio('https://raw.githubusercontent.com/cs6413110/kahoot/main/question.mp3');
const g = new Audio('https://raw.githubusercontent.com/cs6413110/kahoot/main/gameover.mp3');
const s = [l, q, g];
for (const a of s) a.loop = true;
const stopMusic = () => {
  for (const a of s) {
    a.currentTime = 0;
    a.pause();
  }
}
const swapMusic = e => {
  stopMusic();
  s[e].play();
}
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
  const data = JSON.parse(d.data);
  if (data.event === 'code') {
    game.code = data.code;
    document.getElementById('roomID').innerHTML = data.code;
    swapMenu(1);
    swapMusic(0);
  } else if (data.event === 'players') {
    let a = '';
    for (const name of data.names) a += `<div class='player' onclick='kick("${name}")'>${name}</div>`;
    document.getElementById('playerlist').innerHTML = a;
    document.getElementById('playercount').innerHTML = data.names.length+' Players';
  } else if (data.event === 'question') {
    swapMusic(1);
    swapMenu(2);
    document.getElementById('QnA').innerHTML = data.question;
    for (let i = 0; i < 4; i++) document.getElementById(['a', 'b', 'c', 'd'][i]).innerHTML = data.answers[i];
  } else if (data.event === 'scoreboard') {
    stopMusic();
    swapMenu(3);
    let a = '';
    for (const score of data.scores) a += `<div class='player'>#${(data.scores.indexOf(score)+1)}) ${score[0]} --- ${score[1]}</div><br>`; // class can be changed, just tryna use pre-existing styles
    document.getElementById('leaderboard').innerHTML = a;
  } else if (data.event === 'gameover') {
    swapMusic(2);
    document.getElementById('leaderboard').innerHTML =  '<div><h1>Game Over!</h1></div>'+document.getElementById('leaderboard').innerHTML;
  }
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const createGame = () => socket.send({event: 'host', questions: JSON.parse(prompt('Input JSON data for game: ')), time: Number(prompt('Time per question(in seconds)?'))*1000});
const startGame = () => socket.send({event: 'start'});
const kick = name => socket.send({event: 'kick', name});


