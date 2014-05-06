ToiletApp.DoorCensor = (function(){ 
  function DoorCensor( id, options ){
    var _options = options || {};
    this.id = id;
    this.pin = options.pin || A1;
  }
  DoorCensor.prototype = {
    isOpen: function(){
      return this.pin.read();
    }
  };
  return DoorCensor;
})();
