ToiletApp.Wifi = (function(){
  function Wifi(){
    this.wlan = require("CC3000").connect();
    this.isReady = false;
    var _this = this;
    var h = this.wlan.connect( "HWD14_904E2B402303", "8a6g1tijbi2t8ah", function (s) { 
      if (s=="dhcp") {
        console.log('wifi connected!');
        _this.isReady = true;
      }
    });
  }

  return Wifi;

})();
