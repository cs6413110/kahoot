document.body.innerHTML += `
<DOCTYPE html>
<html lang="en-US"> 
  <header>
    <title>Kahooty Rip-off</title>
  </header>
  <body>
  	<!-- Host Game Button -->
    <div id='initial'>
      <button onclick='createGame()'>Host a Game</button>
    </div>
    
    <!-- Pre-Game Lobby -->
    <div id="lobby">
      <div class="hostRoom">
        <div class="code">Room Code</div>
        <div id='roomID'>------</div>
	<button onclick='startGame()'>Start Game</button>
      </div>
      <div id='playercount'></div>
      <div class="playerDisplay" id='playerlist'>
      <!--
        <div class="player">Aaron</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
        <div class="player">Seth</div>
      -->
      </div>
    </div>
    
    <!-- In Game QnA -->
    <div id="q&a">
      <div class="container">
        <div class="question" id="QnA"><strong>Question:</strong><br> <para>What happened in the Willy Wonka Factory?</para> </div>
        <div class="options">
          <div class="option" id="a">Exploded</div>
          <div class="option" id="b">Burned</div>
          <div class="option" id="c">Grew legs and walked away</div>
          <div class="option" id="d">Dug a hole and barried itself</div>
        </div>
        <div class="timer">--</div>
      </div>
    </div>
    
    <!-- LeaderBoard -->
    <div id="leaderBoard">
      <div class="score">Soon to be a score menu</div>
    </div>
  </body>  

  <style>
    body {background-color: powderblue; overflow-x:hidden;}
    
    /* LeaderBoard */
    
    /* Host Game Button */
    #initial {
      position: absolute;
      top: 20%;
      left: 50%;
      scale: 150%;
      transform: translateX(-50%);
      width: auto;
      padding: 5px 5px;
      border-radius: 4px;
    }
    
    
        /* Pre-Game Lobby */
    .hostRoom {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      left: 25%;
      background-color: #f0f0f0;
      padding: 2px 2px;
      border: 1px solid black;
      border-radius: 8px;
    }
    .playerDisplay {
      position: absolute;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      height: 75%;
      width: 90%;
      padding: 5px;
      margin: 2.5%;
      background-color: #f0f0f0;
      border: 1px solid black;
      border-radius: 16px;
    }
    /* Player Lobby Display For Now. */
    .player {
      height: 20px;
      width: auto;
      background-color: #f0f0f0;
      text-align: center;
      padding: 6px;
      border: 1px solid black;
      border-radius: 8px;
      margin: 5px;
    }
    
    	/* In-Game Questions */
     
    .container {
      position: relative;
      top: 0px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .question {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      overflow: wrap;
      justify-content: center;
      padding: 10px;
      background-color: #f0f0f0;
      border: 2px solid #ccc;
      border-radius: 8px;
    }
    .options {
      display: flex;
      flex-direction: column;
      margin-bottom: 50px;
    }
    .option {
      padding: 10px;
      margin: 5px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .option:hover {
      transform: scale(0.98);
      cursor: pointer;
    }
    .timer {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 200%;
      width: 30px;
      height: 30px;
      background-color: #f0f0f0;
      padding: 5px 10px;
      border: 1px solid black;
      border-radius: 1000px;
    } 
  </style>
</html>
`;
const initial = document.getElementById('initial');
const lobby = document.getElementById('lobby');
const qna = document.getElementById('q&a');
const k = [initial, lobby, qna], swapMenu = e => {
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
    const a = data.names.reduce((a, c) => a+'<br>'+c); // can optimize for styling later
    document.getElementById('playerlist').innerHTML = a;
    document.getElementById('playercount').innerHTML = data.names.length+' Players';
  }
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const createGame = () => {
  socket.send({event: 'host', questions: JSON.parse(prompt('Input JSON data for game: ')), time: Number(prompt('Time per question(in seconds)?'))*1000});
  /*
  JSON format for questions:
  [{question: '', answers: ['a', 'b', 'c', 'd'], correct: 0(a), time: 30}]
  */
}

const startGame = () => socket.send({event: 'start'});


