var express = require('express');
var app = express();
var port = 3000;
var router = express.Router();

app.get('/', function (req, res) {
  res.send('first APPAPPAPAPAPPPAAAPAPA!!');
}); 
 
app.listen( port, function(){
    console.log('Express listening on port', port);
});