
ToiletApp.checkDoorTimer = function( door ){
  ToiletApp.checkDoor( door);
  setTimeout( function(){
    ToiletApp.checkDoorTimer( door );
  }, 1000 );
};

ToiletApp.checkDoor = function( door){

  door.toNextState();

  if( door.hasChangedToVacantState() ) R.push( door.id + "-VACANT!!");
  if( door.hasChangedToOccupiedState() ) R.push( door.id + "-OCCUPIED!!");
  console.log( door.state );

};

var LEDs = new LedStatusVisualizer();
var statuses = {
  "initial": 0,
  "started": 1,
  "": 2,
  "": 3,
  "": 4,
  "": 5,
  "": 6,
  "unexpected": 7,
};

var R = void(0);
function onInit(){
  LEDs.show( statuses.started );
  var syncer = new ToiletApp.Syncer();
  R = new ToiletApp.SyncRequestProceccer( {syncer: syncer} );
  
  var d1Censor = new ToiletApp.DoorCensor( "d1", { pin: A1 } );
  var stall1 = new ToiletApp.Stall( {id: "d1", doorCensor: d1Censor });
  
  ToiletApp.checkDoorTimer( stall1 );
  LED1.write(false);
  setTimeout( function(){ R.start(); LED1.write(true);}, 5000 );
}

onInit();

