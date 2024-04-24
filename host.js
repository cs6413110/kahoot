document.body.innerHTML += `
<DOCTYPE html>
<html lang="en-US"> 
  <header>
    <title>Kahooty Rip-off</title>
  </header>
  <body>
    <div class='initial'>
      <button onclick='createGame()'>Host a Game</button>
    </div>
    <div class="container">
      <div class="question" id="QnA">Question: </div>
      <div id='roomID'>asdf</div>
      <div class="options">
        <div class="option">Answer 1:</div>
        <div class="option">Answer 2:</div>
        <div class="option">Answer 3:</div>
        <div class="option">Answer 4</div>
      </div>
      <div class="timer">Timer: 00:00</div>
    </div>
    <div id="lobby"></div>
  </body>  

  <style>
    .container {
      position: relative;
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
      padding: 10px;
      margin: 10px;
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
      transform: scale(0.9);
      cursor: pointer;
    }
    .timer {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #f0f0f0;
      padding: 5px 10px;
      border-radius: 100px;
    }  
    #roomID {
      position: absolute;
      top: 45px;
      left: 10px;
      width: 50px;
      background-color: #f0f0f0;
      padding: 5px 5px;
      border-radius: 4px;
    }
    .initial {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 50px;
      padding: 5px 5px;
      border-radius: 4px;
    }
  </style>
</html>
`;
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
  }
}
socket.onclose = () => alert('Disconnected from server! Please reload.');

const createGame = () => {
  socket.send({event: 'host', questions: prompt('Input JSON data for game: ')});
  
  /*
  JSON format for questions:
  [{question: '', answers: ['a', 'b', 'c', 'd'], correct: 0(a), time: 30}]
  */
  // hide the creategame button
  // load the lobby
  // add handlers for beginGame
  
}

