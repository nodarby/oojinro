var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;

app.use(express.static('frontend/dist'));

io.on('connection',function(socket){
  console.log('connected');
//  socket.on('message',function(msg){
//    console.log('message:'+msg);
//  });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
