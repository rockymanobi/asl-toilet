ToiletApp.SyncRequestProcessor = (function(){

  function SyncRequestProcessor( options ){
    options = options || {};
    this.requests = [];
    this.interval = 2000;
    this.timer = {};
    this.syncer = options.syncer || { sync: function( target ){ console.log( target ); } };
  }

  SyncRequestProcessor.prototype = {

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
      if( !wifi.isReady ){ console.log('not ready'); return; }

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
  
  return SyncRequestProcessor;

})();


