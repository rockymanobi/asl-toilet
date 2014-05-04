shift =  function( array ){
  if( array.length <= 0 ) return void(0);
  var rtn = array[0];
  array = array.slice( 1, array.length );
  return rtn;
}
