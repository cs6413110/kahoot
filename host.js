document.body.innerHTML += `
<!-- Host Side -->


<DOCTYPE html>
  <html lang="en-US"> 
    <header>
      <title>Kahooty Rip-off</title>
    </header>
    
    <body>
      <div class="container">
        <div class="question">Question: </div>

        <div class="options">
          <div class="option">Answer 1:</div>
          <div class="option">Answer 2:</div>
          <div class="option">Answer 3:</div>
          <div class="option">Answer 4</div>
        </div>

        <div class="timer">Timer: 00:00</div>
      </div>
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
        border-radius: 5px;
      }
      
    </style>
  </html>
`;
