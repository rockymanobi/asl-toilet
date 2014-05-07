ToiletApp.Wifi = (function(){
  function Wifi(){
    var def = ToiletApp.def;
    this.wlan = require("CC3000").connect();
    this.isReady = false;
    var _this = this;
    var h = this.wlan.connect( def.wifi.id, def.wifi.password, function (s) { 
      if (s=="dhcp") {
        console.log('wifi connected!');
        _this.isReady = true;
      }
    });
  }

  return Wifi;

})();
