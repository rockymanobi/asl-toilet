
ToiletApp = ToiletApp || {};
ToiletApp.heatBeatRequest =  function(){
  console.log("heatbeat");
}

setInterval( ToiletApp.heatBeatRequest, 60 * 5 * 1000 );
