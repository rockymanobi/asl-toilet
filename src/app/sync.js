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
      nextAction = function(){_this._httpActionTimer(_this)}
      _this._httpAction();
      _this.timer = setTimeout( nextAction, _this.interval );
    },

    // there might be no support for array#shift on Espruino.
    _shiftRequest: function(){
      if( this.requests.length <= 0  ) return;
      var rtn = requests[0];

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
    }
  }
  return SyncRequestProceccer;

})();

http = function(){
  var wlan = require("CC3000").connect();
  var connectedToWlan = wlan.connect( "AccessPointName", "WPA2key", function (s) { 
    if (s=="dhcp") {
      heatBeat();
      sync();
    }
  });

  if(!connected){
    console.log("ngngngng");
  }
}



sync = function(s){
  require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
    res.on('data', function(data) {
      console.log(">" + data);
    });
  });
}


