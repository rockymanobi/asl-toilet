ToiletApp.DoorCensor = (function(){ 
  function DoorCensor( id ){
    this.id = id;
  }
  DoorCensor.prototype = {
    isOpen: function(){
      return A1.read();
    }
  };
  return DoorCensor;
})();
