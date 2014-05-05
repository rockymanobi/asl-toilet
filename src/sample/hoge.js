
ToiletApp.DoorCensor = (function(){ 
  function DoorCensor( id ){
    this.id = id;
  }
  DoorCensor.prototype = {
    isOpen: function(){
      return BTN1.read();
    }
  };
})();

