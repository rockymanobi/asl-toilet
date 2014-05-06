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
