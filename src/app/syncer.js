ToiletApp.Syncer = (function(){
  function Syncer(){
    this.http = require("http");
  }
  
  Syncer.prototype = {
    sync: function( target ){
      var payload = {
        id: "",
        status: target
      };
      var urlpayload = "id=" + payload.id +"&status=" + payload.status;
 
      var options = {
        host: '192.168.100.100',
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
