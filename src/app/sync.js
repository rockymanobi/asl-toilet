ToiletApp = ToiletApp || {};

ToiletApp.SyncRequestProceccer = function( options ){
  options = options || {};
  this.requests = [];
  this.interval = 2000;
  this.timer = {};
  this.syncer = options.syncer || { sync: function( target ){ console.log( target ); } };
}

ToiletApp.SyncRequestProceccer.prototype = {

  _httpActionTimer: function( _this ){
    nextAction = function(){_this._httpActionTimer(_this)}
    _this._httpAction();
    _this.timer = setTimeout( nextAction, _this.interval );
  },

  _httpAction: function(){
    var target = this.requests.shift();
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

