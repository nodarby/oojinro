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
  player.set("roomSlug",null)
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

// 名前を変える
app.post('/api/v1/profile', function(req, res){
  console.log(req.body)
  Player.equalTo('slug', req.body.userSlug).fetch().then(function(result){
    if(0!==Object.keys(result).length) {
      // 名前を変えることができたら情報を返す
      result.set("name",req.body.userName)
      result.update()
      console.log(result)
      res.json({
        userSlug: result.slug,
        userName: result.name
      })
    }else{
      // 変更できなかったらエラー
      res.status(400).json({})
    }
  }).catch(function(error){
    console.log(error)
    // 取ってこれなかったらエラーを返す
    res.status(500).json({
    })
  })
})

app.post('/api/v1/room/create', function(req, res){
  //部屋番号を生成
    let room = new Room()
    room.set("slug", ('000'+Math.floor(Math.random() * 10000)).slice(-4))
    room.set("classes",{
          "村人": 0,
          "占い師": 0,
          "怪盗":0,
          "人狼":0,
          "狂人":0,
          "吊人":0,
        })
    room.save().then(function(result){
      console.log(result)
      res.json({
        roomSlug: result.slug
      })
    }).catch(function(error){
      res.status(500).json({})
    })
})

//入室処理
app.post('/api/v1/room/enter', function(req, res){

  (async () => {
    //部屋がすでに存在するか判定
    let newRoom = await Room.equalTo("slug",req.body.roomSlug).fetch()

    //もし部屋があれば行う
    if(0 !== Object.keys(newRoom).length){
      let player = await Player.equalTo("slug",req.body.userSlug).fetch()
      console.log("player探したよ")
      console.log(player)
      const oldRoomSlug = player.roomSlug

      //リロードか新たな参加かを判断
      if(oldRoomSlug !== newRoom.roomSlug){
        player.set("roomSlug",req.body.roomSlug)
        player = await player.update()

        //同じ部屋の人数分村人を増やす
        const players = await Player.equalTo("roomSlug",player.roomSlug).fetchAll()
        console.log("ほかのひと探したよ",players)
        newRoom.classes["村人"] = players.length
        newRoom = await newRoom.update()
        console.log("村人足したよ",newRoom)

        //全員に変化を伝える
        for(let player of players){
          console.log("フォー",player)
          io.to(player.socketSlug).emit("/ws/v1/room/entered",{
            users: players,
            roomSlug: newRoom.roomSlug,
            classes: newRoom.classes
          })
        }
      }

      //リロードの場合、元の部屋の情報を与える
      const players = await Player.equalTo("roomSlug",player.roomSlug).fetchAll()
      console.log("ほかのひと探したよ2",players)
      res.json({
        users: players,
        roomSlug: newRoom.roomSlug,
        classes: newRoom.classes
      })

      //部屋が存在しない場合エラーを返す
    }else{
      res.status(500).json({})
    }
  })().catch(function (){
    res.status(500).json({})
  })
})


  //接続時にsocketのIDを登録
app.post("/api/v1/socket/connected",function(req,res){
    (async()=>{

      let result = await Player.equalTo("slug",req.body.userSlug).fetch()
      console.log("人を特定したよ",result)
      result.set("socketSlug",req.body.socketSlug)
      let socketresult = await result.update()

      //更新できているか確認
      console.log("ソケットIDこれよ",socketresult)
      res.json(
        socketresult
      )
    })().catch(function (){
      res.status(500).json({})
    })
  })

/*
app.post("/api/v1/room/class",function(req,res){
  (async()=>{

    let room = await Room.equalTo("slug",req.body.roomSlug)
    console.log("見つけたよ",room)
    room.set("classes",req.body.classes)
    let class = await room.update()
    console.log("更新したよ",class)

    const players = await Player.equalTo("roomSlug",class.slug).fetchAll()
    for(let player of players){
      console.log("送ります",player)
      io.to(player.socketSlug).emit("/ws/v1/room/class",{
        classes: .classes
      })
    }
  })().catch(function (){
    res.status(500).json({})
  })
})
*/
// ファイルのルーティング

// frontend/distフォルダを返す
app.use(express.static('frontend/dist'))
// 存在しなければindex.htmlを返す
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html")
});


io.on('connection',function(socket){

  socket.on("/ws/v1/room/request_class_change",function(change){
    (async()=>{

      const players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      for(let player of players){
        console.log("送ります",player)
        io.to(player.socketSlug).emit("/ws/v1/room/response_class_change",{
          classes: change.classes
        })
      }
    })().catch(function (){
      res.status(500).json({})
    })
  })

})

/*
const arr = [1,2,3,4,5,6,7,8,9]
const a = arr.length

//シャッフルアルゴリズム
while (a) {
    const j = Math.floor( Math.random() * a )
    const t = arr[--a]
    arr[a] = arr[j]
    arr[j] = t
}

//シャッフルされた配列の要素を順番に表示する
arr.forEach( function( value ) {console.log( value )} )
return ""
}


*/
http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
