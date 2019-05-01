var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;
var NCMB = require("ncmb");
var ncmb = new NCMB(process.env.APPLICATION_KEY,process.env.CLIANT_KEY);
var roomClass = ncmb.DataStore("room");

  let product = new roomClass();



app.use(express.static('frontend/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html");
});

io.on('connection',function(socket){
  socket.on("requestRoomName",function(){
    console.log("受け取ったよ～");
    var  l = 8;
    var c = "0123456789"
    var cl = c.length;
    var num = "";
    for(var i=0; i<l;i++){
      num += c[Math.floor(Math.random()*cl)];
    }
    socket.emit("responseRoomName",num);
    console.log("送ったよ～");
  });


/*  socket.on('createRoom',function(create){
    product.set("room_id",create.body.room_id);
    product.set("name",create.body.name);
    product.save();
  });*/

//  socket.on('message',function(msg){
//    console.log('message:'+msg);
//  });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
