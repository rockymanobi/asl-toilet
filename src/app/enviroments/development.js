//=require app/fake/fake

// require
EsRequire = function(moduleName){

  if(moduleName == "CC3000"){
    return FakeCC3000;
    console.log(1111);
  }
}

// CC3000
FakeCC3000 = {
  connect: function(){
    return true;
  } 
}

// Pin Class
EsPin = function(options){
  this.name = options.name;
};

EsPin.prototype = { 
  write: function( val ){
    console.log(this.name + " write:" + val );
  }
};

var EsLED1 = new EsPin({name: "LED1"});
var EsLED2 = new EsPin({name: "LED2"});
var EsLED3 = new EsPin({name: "LED3"});

var EsA1 = new EsPin({name: "A1"});
var EsA2 = new EsPin({name: "A2"});
var EsA3 = new EsPin({name: "A3"});
var EsA4 = new EsPin({name: "A4"});
var EsA5 = new EsPin({name: "A5"});
var EsA6 = new EsPin({name: "A6"});
var EsA7 = new EsPin({name: "A7"});



