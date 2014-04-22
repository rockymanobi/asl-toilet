
ToiletApp = {}
var requests = [];

///////////////////////////////////////////
// DOOR CLASS
//  options.id
//  options.
/////////////////////////////////////////// 

ToiletApp.Door = function( options ){
  this.state = "initial";
  this.beforeState = "initial";
  this.id = options.id;
  this.doorCensor = options.doorCensor;
}

ToiletApp.Door.prototype = {

  isInitialState: function(){ return this.state == "initial"; },
  isMaybeOpenState: function(){ return this.state == "maybe_open"; },
  isOpenState: function(){ return this.state == "open"; },
  isMaybeCloseState: function(){ return this.state == "maybe_close"; },
  isCloseState: function(){ return this.state == "close"; },

  getNextState: function(){
    var nextState;
    if( this.isInitialState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }else if( this.isOpenState() ){
      if( this.doorCensor.isOpen() ){
        nextState= "open"
      }else{
        nextState = "maybe_close"
      }
    }else if( this.isMaybeCloseState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }else if( this.isCloseState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "maybe_open"
      }else{
        nextState = "close"
      }
    }else if( this.isMaybeOpenState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }
    return nextState;
  },

  toNextState: function(){
    this.beforeState = this.state;
    this.state = this.getNextState();
  },

  hasChangedToCloseState: function(){
    var openToClose = this.beforeState == "maybe_close" && this.state == "close";
    var initialToClose = this.beforeState == "initial" && this.state == "close";
    return openToClose || initialToClose;
  },
  hasChangedToOpenState: function(){
    var closeToOpen = this.beforeState == "maybe_open" && this.state == "open";
    var initialToOpen = this.beforeState == "initial" && this.state == "open";
    return closeToOpen || initialToOpen;
  }
}

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
// waite until espruino will finally come.
///////////////////////////////////////////
ToiletApp.Fake = {}
ToiletApp.Fake.DoorCensor = function( id ){
  this.id = id;
}

ToiletApp.Fake.DoorCensor.prototype = {
  isOpen: function(){
    var element = document.getElementById( this.id + "-door-state"); 
    return element.innerText == "[OPEN]";
  }
}

ToiletApp.Fake.toggleDoor = function( id ){
  var element = document.getElementById(id + "-door-state"); 
  var text = "";
  if( element.innerText == "[OPEN]" ){
    text = "[CLOSE]";
  }else{
    text = "[OPEN]";
  }
  element.innerText = text;
}

ToiletApp.Fake.Interactor = function( id ){
  this.id = id;
}
ToiletApp.Fake.Interactor.prototype = { 
  showProgress: function(){
    var counter = document.getElementById( this.id + "-counter"); 
    counter.innerText = counter.innerText + ".";
  },
  showState: function( door ){
    var element = document.getElementById( this.id + "-state"); 
    element.innerText = door.state;
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
/////////////////////////

