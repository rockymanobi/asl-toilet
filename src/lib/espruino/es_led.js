EsLED = (function(){
  function EsLED(options){
    this.pin = options.pin || LED1;
    this.blinkInterval = options.blinkInterval || 100;
    this.blinkTimer = void(0);
    this.initialize();
  }
  
  EsLED.prototype = {
    initialize: function(){
      this.turnOff();
    },
    turnOn: function(){
      this.pin.write( true );
    },
    turnOff: function(){
      this.pin.write( false );
    },
    blinkOn: function(){
      var pin = this.pin, light = false;
      this.blinkTimer = setInterval(function(){
        light = !light;
        pin.write( light );
      }, this.blinkInterval);
    },
    blinkOff: function(){
      clearInterval( this.blinkTimer );
      this.turnOff();
    }
  };
  
  return EsLED;
})();
