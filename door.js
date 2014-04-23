
ToiletApp = ToiletApp || {};
ToiletApp.Door = function( options ){
  this.state = "initial";
  this.beforeState = "initial";
  this.id = options.id;
  this.doorCensor = options.doorCensor;
}

ToiletApp.Door.prototype = {

  isInitialState: function(){ return this.state == "initial"; },
  isMaybeOpenState: function(){ return this.state == "maybe_open"; },
  isOpenState: function(){ return this.state == "open"; },
  isMaybeCloseState: function(){ return this.state == "maybe_close"; },
  isCloseState: function(){ return this.state == "close"; },

  getNextState: function(){
    var nextState;
    if( this.isInitialState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }else if( this.isOpenState() ){
      if( this.doorCensor.isOpen() ){
        nextState= "open"
      }else{
        nextState = "maybe_close"
      }
    }else if( this.isMaybeCloseState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }else if( this.isCloseState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "maybe_open"
      }else{
        nextState = "close"
      }
    }else if( this.isMaybeOpenState() ){
      if( this.doorCensor.isOpen() ){
        nextState = "open"
      }else{
        nextState = "close"
      }
    }
    return nextState;
  },

  toNextState: function(){
    this.beforeState = this.state;
    this.state = this.getNextState();
  },

  hasChangedToCloseState: function(){
    var openToClose = this.beforeState == "maybe_close" && this.state == "close";
    var initialToClose = this.beforeState == "initial" && this.state == "close";
    return openToClose || initialToClose;
  },
  hasChangedToOpenState: function(){
    var closeToOpen = this.beforeState == "maybe_open" && this.state == "open";
    var initialToOpen = this.beforeState == "initial" && this.state == "open";
    return closeToOpen || initialToOpen;
  }
}
