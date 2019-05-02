const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyParser = require('body-parser')

const io = require('socket.io')(http)
const PORT = process.env.PORT || 8080

const NCMB = require('ncmb')
const ncmb = new NCMB(process.env.APPLICATION_KEY,process.env.CLIENT_KEY);

const Room = ncmb.DataStore("room")
const Player = ncmb.DataStore("player")

app.use(bodyParser())

// CORSの設定(おまじない)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// login
app.post('/api/v1/login', function(req, res){
  console.log(req.body)
  Player.equalTo('slug', req.body.userSlug).fetch().then(function(result){
    if(0!==Object.keys(result).length) {
      // ログインできたら情報を返す
      console.log(result)
      res.json({
        userSlug: result.slug,
        userName: result.name
      })
    }else{
      // ログインできなかったらエラー
      res.status(400).json({})
    }
  }).catch(function(error){
    console.log(error)
    // 取ってこれなかったらエラーを返す
    res.status(500).json({})
  })
})

// signup
app.post('/api/v1/signup', function(req, res){

  // 新規プレイヤーの作成
  let player = new Player()
  player.set("slug", new Date().getTime().toString(16) + Math.floor(Math.random() * 10000).toString(16))
  player.set("name", null)
  player.save().then(function(result){
    console.log(result)
    // 保存できたらslugを返す
    res.json({
      userSlug: result.slug,
      userName: result.name
    })
  }).catch(function(error){
    console.log(error)
    // 保存できなかったらエラーを返す
    res.status(500).json({})
  })
})

// ファイルのルーティング

// frontend/distフォルダを返す
app.use(express.static('frontend/dist'))
// 存在しなければindex.htmlを返す
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html")
});


io.on('connection',function(socket){
  socket.on('requestCreateRoom',function(uuid){
    //部屋番号をランダムに作成してクライアントに伝える。
    let product = new Room();
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
    product.set("members",[]);
    product.save().then(function(res){
      socket.emit("responseCreateRoom", num);
    }).catch(function(err){
      socket.emit("responseCreateRoom", null);
    });
  });

    socket.on('requestEnterRoom',function(person){
      //受け取った部屋番号が存在するか判定
      Room.equalTo("room_name",person.roomName)
          .fetch()
          .then(function(results){
            if(0==Object.keys(results).length){
              socket.emit("responseEnterRoom",null);
            }else{
            results.members.push({uuid:person.uuid})
            results.update();
            console.log(results); // 検索結果の件数を表示
            socket.join(person.roomName);
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
        Room.equalTo("room_name",person.roomName)
            .fetch()
            .then(function(result){
              const index = result.members.findIndex(function(p){ return p.uuid === person.uuid })
              result.members[index].userName = person.userName
              console.log(result)
              result.update();
            })
      })

    socket.on("requestExitRoom",function(person){
      Room.equalTo("room_name",person.roomName)
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
