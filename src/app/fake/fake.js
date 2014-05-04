ToiletApp = ToiletApp || {};
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
