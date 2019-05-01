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
  socket.on('requestCreateRoom',function(uuid){
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
    socket.emit("responseCreateRoom",num);
    product.set("room_name",num);
    product.set("members",{uuid:uuid});
    product.save();

/*      //ランダムトークン作成
      var  l = 10;
      var c = "abcdefghijklmnopqrstuvwxyz0123456789";
      var cl = c.length;
      var token = "";
      for(var i=0; i<l;i++){
        token += c[Math.floor(Math.random()*cl)];
      }
      */
    });

    //役職振り分け
    socket.on("スタートの合図的な",function(){

    })

    //役職ごとの処理


  });


http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
