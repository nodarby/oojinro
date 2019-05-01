var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 8080;

app.use(express.static('frontend/dist'));

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
