var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;
var NCMB = require("ncmb");
var ncmb = new NCMB(process.env.APPLICATION_KEY,process.env.CLIENT_KEY);
var roomClass = ncmb.DataStore("room");
  let product = new roomClass();



app.use(express.static('frontend/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html");
});

io.on('connection',function(socket){
  socket.on("requestRoomName",function(){
    //部屋番号をランダムに作成してクライアントに伝える。
    var  l = 8;
    var c = "0123456789"
    var num = "";
    var cl = c.length;
    for(var i=0; i<l;i++){
      num += c[Math.floor(Math.random()*cl)];
    }
    //ニフクラのデータベースを検索し重複がないか確認。
    //最初にすべてのデータを持ってくると非同期処理にならない。それを参照。
    socket.emit("responseRoomName",num);
  });

  socket.on('createRoom',function(create){
      product.set("room_name",create.body.room_name);
      //ランダムトークン作成
      var  l = 10;
      var c = "abcdefghijklmnopqrstuvwxyz0123456789";
      var cl = c.length;
      var token = "";
      for(var i=0; i<l;i++){
        token += c[Math.floor(Math.random()*cl)];
      }
      product.set("members",{name:create.body.name,token:token});
      product.save();
    })
  });


http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
