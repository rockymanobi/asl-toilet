ToiletApp.DoorSensor = (function(){ 
  function DoorSensor( id, options ){
    var _options = options || {};
    this.id = id;
    this.pin = options.pin || A1;
  }
  DoorSensor.prototype = {
    isOpen: function(){
      return this.pin.read();
    }
  };
  return DoorSensor;
})();
