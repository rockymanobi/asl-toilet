
ToiletApp = ToiletApp || {};
var requests = [];

ToiletApp.checkDoor = function( door, interactor ){
  // display 
  interactor.showProgress();

  door.toNextState();

  if( door.hasChangedToOpenState() ) requests.push( door.id + "-OPEN!!");
  if( door.hasChangedToCloseState() ) requests.push( door.id + "-CLOSE!!");

  interactor.showState(door);

}

ToiletApp.checkDoorTimer = function( door, interactor ){
  ToiletApp.checkDoor( door, interactor );
  setTimeout( function(){
    ToiletApp.checkDoorTimer( door, interactor );
  }, 1000 );
}


//////////////////////////////////
//////////////////////////////////
httpActionTimer = function(){
  httpAction();
  setTimeout( httpActionTimer, 2000 );
}

httpAction = function( ){
  var target = requests.shift();
  var element = document.getElementById("action"); 
  var text = "";
  if( target ){
    text = target + " ||| ";
    element.innerText = element.innerText + text;
  }
}
///////////////////////////////////////////
// main logic
///////////////////////////////////////////
function main(){

  var d1Censor = new ToiletApp.Fake.DoorCensor( "d1" );
  var door1 = new ToiletApp.Door( {id: "d1", doorCensor: d1Censor });
  var d1Interactor = new ToiletApp.Fake.Interactor( "d1" );

  var d2Censor = new ToiletApp.Fake.DoorCensor( "d2" );
  var door2 = new ToiletApp.Door( {id: "d2", doorCensor: d2Censor });
  var d2Interactor = new ToiletApp.Fake.Interactor( "d2" );

  ToiletApp.checkDoorTimer( door1, d1Interactor );
  ToiletApp.checkDoorTimer( door2, d2Interactor );
  httpActionTimer();

}

main();



