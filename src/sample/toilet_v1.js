util = {
  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
};


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






ToiletApp = ToiletApp || {};

ToiletApp.SyncRequestProceccer = (function(){

  function SyncRequestProceccer( options ){
    options = options || {};
    this.requests = [];
    this.interval = 2000;
    this.timer = {};
    this.syncer = options.syncer || { sync: function( target ){ console.log( target ); } };
  }

  SyncRequestProceccer.prototype = {

    _httpActionTimer: function( _this ){
      nextAction = function(){_this._httpActionTimer(_this);};
      _this._httpAction();
      _this.timer = setTimeout( nextAction, _this.interval );
    },

    // there might be no support for array#shift on Espruino.
    _shiftRequest: function(){
      if( this.requests.length <= 0  ) return void(0);
      var rtn = this.requests[0];

      this.requests = this.requests.slice( 1, this.requests.length );
      return rtn;
    },

    _httpAction: function(){
      var target = this._shiftRequest();
      if(!target) return; 

      this.syncer.sync( target );
    },
    start: function(){
      this._httpActionTimer( this );
    },
    stop: function(){
      clearTimeout( this.timer );
    },
    push: function( val ){
      this.requests.push( val );
    }
  };
  
  return SyncRequestProceccer;

})();



ToiletApp.Syncer = (function(){
  function Syncer(){
    this.wlan = require("CC3000").connect();
    this.http = require("http");
    
    var h = this.wlan.connect( "HWD14_904E2B402303", "8a6g1tijbi2t8ah", function (s) { 
      if (s=="dhcp") {
        console.log('wifi connected!');
      }
    });
  }
  
  Syncer.prototype = {
    sync: function( target ){
      var payload = {
        id: "",
        status: target
      };
      var urlpayload = "id=" + payload.id +"&status=" + payload.status;
 
      var options = {
        host: '192.168.100.102',
        port: '3000',
        path: '/sample_requests',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': urlpayload.length
        },
        method: 'POST'
      };
      
      var http = this.http;
            
      var req = http.request( options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });
      
      req.write( urlpayload );
      req.end();
    }
    
  };
  
  return Syncer;
  
})();
///////////////////////////////////
///////////////////////////////////


ToiletApp = ToiletApp || {};
ToiletApp.Stall = ( function(){
  function Stall( options ){
    var statuses = ToiletApp.Stall.STATUSES;
    this.state = statuses.initial;
    this.beforeState = statuses.initial;
    this.id = options.id;
    this.doorCensor = options.doorCensor;
  }

  Stall.STATUSES = {
    initial: "initial",
    vacant: "vacant",
    maybe_occupied: "maybe_occupied",
    occupied: "occupied",
    maybe_vacant: "maybe_vacant"
  };

  Stall.prototype = {
  
    isInitial: function(){ return this.state == Stall.STATUSES.initial; },
    isMaybeVacant: function(){ return this.state == Stall.STATUSES.maybe_vacant; },
    isVacant: function(){ return this.state == Stall.STATUSES.vacant; },
    isMaybeOccupied: function(){ return this.state == Stall.STATUSES.maybe_occupied; },
    isOccupied: function(){ return this.state ==  Stall.STATUSES.occupied; },
  
    _getNextState: function(){
      var statuses = ToiletApp.Stall.STATUSES;
      var nextState;
      if( this.isInitial() ){
        if( this.doorCensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isVacant() ){
        if( this.doorCensor.isOpen() ){
          nextState= statuses.vacant;
        }else{
          nextState = statuses.maybe_occupied;
        }
      }else if( this.isMaybeOccupied() ){
        if( this.doorCensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isOccupied() ){
        if( this.doorCensor.isOpen() ){
          nextState = statuses.maybe_vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isMaybeVacant() ){
        if( this.doorCensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }
      return nextState;
    },
  
    toNextState: function(){
      this.beforeState = this.state;
      this.state = this._getNextState();
    },
  
    hasChangedToOccupiedState: function(){
      var statuses = Stall.STATUSES;
      var openToClose = this.beforeState == statuses.maybe_occupied && this.state == statuses.occupied;
      var initialToClose = this.beforeState == "initial" && statuses.initial == statuses.occupied;
      return openToClose || initialToClose;
    },
    hasChangedToVacantState: function(){
      var statuses = Stall.STATUSES;
      var closeToOpen = this.beforeState == statuses.maybe_vacant && this.state == statuses.vacant;
      var initialToOpen = this.beforeState == statuses.initial && this.state == statuses.vacant;
      return closeToOpen || initialToOpen;
    }
  };
  return Stall;
})();







 
///////////////////////////////////
///////////////////////////////////




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


///////////////////////////////////
///////////////////////////////////
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
  
  var d1Censor = new ToiletApp.DoorCensor( "d1" );
  var stall1 = new ToiletApp.Stall( {id: "d1", doorCensor: d1Censor });
  
  ToiletApp.checkDoorTimer( stall1 );
  LED1.write(false);
  setTimeout( function(){ R.start(); LED1.write(true);}, 5000 );
}

onInit();


