var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;
var NCMB = require("ncmb");
var ncmb = new NCMB(process.env.APPLICATION_KEY,process.env.CLIENT_KEY);
var roomClass = ncmb.DataStore("room");



app.use(express.static('frontend/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html");
});

io.on('connection',function(socket){
  socket.on('requestCreateRoom',function(uuid){
    //部屋番号をランダムに作成してクライアントに伝える。
    let product = new roomClass();
    var  l = 8;
    var c = "0123456789"
    var num = "";
    var cl = c.length;
    for(var i=0; i<l;i++){
      num += c[Math.floor(Math.random()*cl)];
    }
    //ニフクラのデータベースを検索し重複がないか確認。
    //最初にすべてのデータを持ってくると非同期処理にならない。それを参照。
    product.set("room_name",num);
    product.set("members",[{uuid:uuid}]);
    product.save().then(function(res){
      socket.emit("responseCreateRoom", num);
    }).catch(function(err){
      socket.emit("responseCreateRoom", null);
    });
  });

    socket.on('requestEnterRoom',function(person){
      //受け取った部屋番号が存在するか判定
      roomClass.equalTo("room_name",person.roomName)
          .fetch()
          .then(function(results){
            if(0==Object.keys(results).length){
              socket.emit("responseEnterRoom",null);
            }else{
            results.set("members",results.members)
            console.log(results); // 検索結果の件数を表示
            socket.emit("responseEnterRoom",{roomName:person.roomName,members:results.members});
            }
          }).catch(function(err){
            console.log(err);
            socket.emit("responseEnterRoom",null);
          });


      //ニフクラのデータベースを検索し存在するか確認。
      //最初にすべてのデータを持ってくると非同期処理にならない。それを参照。
/*      product.set("room_name",num);
      product.set("members",{uuid:uuid});
      product.save();*/

      });
    socket.on("requestUpdateUser",function(person){
      //ユーザの名前登録
        roomClass.equalTo("room_name",person.roomName)
            .fetch()
      })

    socket.on("requestExitRoom",function(person){
      roomClass.equalTo("room_name",person.roomName)
          .fetch()
          .then(function(result){
            result.delete();
          })
          .catch(function(err){

          });
    })
    //部屋の削除


    //役職振り分け
    socket.on("スタートの合図的な",function(){

    })

    //役職ごとの処理


  });


http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
