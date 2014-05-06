LedStatusVisualizer = (function(){
  function LedStatusVisualizer(){
    this.digits = {
      "d4": { pin: LED1 } ,
      "d2": { pin: LED2 } ,
      "d1": { pin: LED3 }
    };
  }
  
  LedStatusVisualizer.prototype = {
    show: function( num ){
      
      var n = Number(num).toString( 2 );
      n = util.pad( n, 3, "0");
      console.log(n);
      this._showBinary(n);
    },
    
    _showBinary: function( bin ){
      this.digits.d4.pin.write( bin.charAt(0) == "1" );
      this.digits.d2.pin.write( bin.charAt(1) == "1" );
      this.digits.d1.pin.write( bin.charAt(2) == "1" );
    }
  };
  
  return LedStatusVisualizer;
})();





