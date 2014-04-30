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


heatBeat = function(s){
  console.log("heatBeat");
}

sync = function(s){
  console.log("hoge");
  return;
  require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
    res.on('data', function(data) {
      console.log(">" + data);
    });
  });
}


