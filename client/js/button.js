// function sendEvent(event, data) {
//     socket.emit(event, data);
//   }


//for new games, this may need a name passed in
document.getElementById("newGameButton").addEventListener("click", function(){
    sendEvent('new game');
  });


//joins games, takes input from form field
document.getElementById("joinGameButton").addEventListener("click", function(){
    let gameID = document.getElementById("joinGameID").value;
    sendEvent('join game', gameID);
  });