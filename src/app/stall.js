/*
 * [stall] chiefly US :
 *   a small, enclosed area with room for one person in a bathroom 
 *   ▪ shower stalls ; especially : a small, enclosed area with a toilet 
 *   ▪ All the (bathroom) stalls were occupied.
 */
ToiletApp = ToiletApp || {};
ToiletApp.Stall = function( options ){
  var statuses = ToiletApp.Stall.STATUSES;
  this.state = statuses.initial;
  this.beforeState = statuses.initial;
  this.id = options.id;
  this.doorCensor = options.doorCensor;
}

ToiletApp.Stall.STATUSES = {
  initial: "initial",
  vacant: "vacant",
  maybe_occupied: "maybe_occupied",
  occupied: "occupied",
  maybe_vacant: "maybe_vacant"
}

ToiletApp.Stall.prototype = {

  isInitial: function(){ return this.state == ToiletApp.Stall.STATUSES.initial; },
  isMaybeVacant: function(){ return this.state == ToiletApp.Stall.STATUSES.maybe_vacant; },
  isVacant: function(){ return this.state == ToiletApp.Stall.STATUSES.vacant; },
  isMaybeOccupied: function(){ return this.state == ToiletApp.Stall.STATUSES.maybe_occupied; },
  isOccupied: function(){ return this.state ==  ToiletApp.Stall.STATUSES.occupied; },

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
    var statuses = ToiletApp.Stall.STATUSES;
    var openToClose = this.beforeState == statuses.maybe_occupied && this.state == statuses.occupied;
    var initialToClose = this.beforeState == "initial" && statuses.initial == statuses.occupied;
    return openToClose || initialToClose;
  },
  hasChangedToVacantState: function(){
    var statuses = ToiletApp.Stall.STATUSES;
    var closeToOpen = this.beforeState == statuses.maybe_vacant && this.state == statuses.vacant;
    var initialToOpen = this.beforeState == statuses.initial && this.state == statuses.vacant;
    return closeToOpen || initialToOpen;
  }
}
