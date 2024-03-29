require('dotenv').config()

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
app.post('/api/v1/profile', async function (req, res) {
  console.log(req.body)
  await Player.equalTo('slug', req.body.userSlug).fetch().then(async function (result) {
    if (0 !== Object.keys(result).length) {
      // 名前を変えることができたら情報を返す
      result.set("name", req.body.userName)
      await result.update()
      console.log(result)
      res.json({
        userSlug: result.slug,
        userName: req.body.userName
      })
      if (result.roomSlug != "") {
        await Player.equalTo('roomSlug', result.roomSlug).fetchAll().then(function (players) {
          for (let player of players) {
            io.to(player.socketSlug).emit("/ws/v1/room/name_change", {
              users: players
            })

          }
        })
      }
    } else {
      // 変更できなかったらエラー
      res.status(400).json({})
    }
  }).catch(function (error) {
    console.log(error)
    // 取ってこれなかったらエラーを返す
    res.status(500).json({})
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
    room.set("flag","True")
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
        if(oldRoomSlug !== newRoom.slug){
          if(newRoom.enableFlag == "False"){
            res.status(500).json({})
          }
          else{
            console.log("前",oldRoomSlug)
            console.log("後",newRoom.slug)
            player.set("roomSlug",req.body.roomSlug)
            player.set("phase","GameWaiting")
            player = await player.update()

            //元いた部屋が無人になった場合に削除
            let join_player = await Player.equalTo("roomSlug",oldRoomSlug).fetchAll()
            console.log()
            if (join_player.length == 0){
              let room = await Room.equalTo("slug", oldRoomSlug).fetch()
              room.delete()
            }


            /*同じ部屋の人数分村人を増やす
            const players = await Player.equalTo("roomSlug",player.roomSlug).fetchAll()
            console.log("ほかのひと探したよ",players)
            newRoom.classes["村人"] = players.length
            newRoom = await newRoom.update()
            console.log("村人足したよ",newRoom)

             */


            //全員に変化を伝える
            const players = await Player.equalTo("roomSlug",player.roomSlug).fetchAll()
            for(let player of players){
              console.log("フォー",player)
              io.to(player.socketSlug).emit("/ws/v1/room/entered",{
                users: players,
                roomSlug: newRoom.slug,
                classes: newRoom.classes,
                phase: player.phase
              })
            }
          }
        }

        //リロードの場合、元の部屋の情報を与える
        const players = await Player.equalTo("roomSlug",player.roomSlug).fetchAll()
        console.log("ほかのひと探したよ2",players)
        let man = await Player.equalTo("slug",req.body.userSlug).fetch()
        if(man.class == "人狼"){
          if(man.phase == "NightResult" || man.phase == "NightEnd"){
            res.json({
              users: players,
              roomSlug: newRoom.slug,
              classes: newRoom.classes,
              phase: man.phase,
              class: man.class,
              new_class: man.new_class,
              target: man.target
            })
          }else{
            res.json({
              users: players,
              roomSlug: newRoom.slug,
              classes: newRoom.classes,
              phase: man.phase,
              class: man.class
            })
          }
        }else{
          if(man.phase == "NightResult" || man.phase == "NightEnd"){
            if(man.target == "field") {
              let classroom = await Room.equalTo("slug", req.body.roomSlug).fetch()
              res.json({
                users: players,
                roomSlug: newRoom.slug,
                classes: newRoom.classes,
                phase: man.phase,
                class: man.class,
                new_class: man.new_class,
                target: {field: true, class: classroom.field}
              })
            }else{
              let tag = await Player.equalTo("slug",man.target).fetch()
              res.json({
                users: players,
                roomSlug: newRoom.slug,
                classes: newRoom.classes,
                phase: man.phase,
                class: man.class,
                new_class: man.new_class,
                target: {field:false,slug:tag.slug,name:tag.name,class:tag.class}

              })
            }
          }else if(man.phase == "DayResult") {
            let vot = await Player.equalTo("slug", player.vote).fetch()
            res.json({
              users: players,
              roomSlug: newRoom.slug,
              classes: newRoom.classes,
              phase: man.phase,
              class: man.class,
              vote: {slug: vot.slug, name: vot.name}
            })
          }else if(man.phase == "GameResult") {
            let classroom = await Room.equalTo("slug",req.body.roomSlug).fetch()
            res.json({
              users: players,
              roomSlug: newRoom.slug,
              classes: newRoom.classes,
              phase: man.phase,
              class: man.class,
              result:classroom.result
            })
          }else{
            res.json({
              users: players,
              roomSlug: newRoom.slug,
              classes: newRoom.classes,
              phase: man.phase,
              class: man.class
            })
          }
        }

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


app.use(express.static('frontend/dist'))
// 存在しなければindex.htmlを返す
app.use(function(req, res, next) {
  res.sendfile("frontend/dist/index.html")
});


io.on('connection',function(socket){

  //役職変更処理
  socket.on("/ws/v1/room/request_class_change",function(change){
    console.log("発火したぞ",change);
    (async()=>{

      let classroom = await Room.equalTo("slug",change.roomSlug).fetch()
      classroom.set("classes",change.classes)
      let result = await classroom.update()

      //送信処理（本人以外）
      let players = await Player.equalTo("roomSlug",change.roomSlug).notEqualTo("slug",change.userSlug).fetchAll()
      for(let player of players){
        io.to(player.socketSlug).emit("/ws/v1/room/response_class_change",{
          classes: change.classes
        })
      }
    })()
  })

  //ゲーム開始処理
  socket.on("/ws/v1/game/request_start",function(change){
    console.log("ゲーム始めるってよ",change);
    (async()=>{

      let classroom = await Room.equalTo("slug",change.roomSlug).fetch()

      var items=[]
      console.log(classroom.classes)

      //配列に役職を加える
      for(let key in classroom.classes){
        console.log(classroom.classes[key])
        var num = classroom.classes[key]
        for(var i=0;i<num;i++){
          items.push(key)
        }
      }

      //ループして役職分配
      let players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      for(let player of players){
        var random = Math.floor(Math.random() * items.length )
        console.log( items[random] )
        player.set("class",items[random])
        player.set("new_class",items[random])
        player.set("target","")
        player.set("phase","NightAction")
        player.set("vote","")
        let socketresult = await player.update()
        items.splice(random,1)
      }
      console.log("場のカード",items)
      let room = await Room.equalTo("slug",change.roomSlug).fetch()
      room.set("field",items)
      room.set("enableFlag","False")
      let socketresult = await room.update()

      //送信処理
      let changer = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      for(let player of changer){
        console.log("送ります",player)
        io.to(player.socketSlug).emit("/ws/v1/game/response_start",{
          class: player.class
        })
      }
    })()
  })

  //占いの夜の行動
  socket.on("/ws/v1/game/request_uranai",function(change){
    console.log("占い",change);
    (async()=>{

      //占い場所が場かどうか
      if (change.targetSlug == ""){
        console.log("場だね")
        let classroom = await Room.equalTo("slug",change.roomSlug).fetch()
        let uranai = await Player.equalTo("slug", change.userSlug).fetch()
        console.log("送ります")
        uranai.set("phase","NightResult")
        uranai.set("target","field")
        let socketresult = await uranai.update()

        io.to(uranai.socketSlug).emit("/ws/v1/game/response_uranai",{
          target: {field: true, class: classroom.field},
          phase:uranai.phase
        })

      } else {
        let player = await Player.equalTo("slug", change.targetSlug).fetch()
        let uranai = await Player.equalTo("slug", change.userSlug).fetch()
        console.log("送ります")
        uranai.set("phase","NightResult")
        uranai.set("target",player.slug)
        let socketresult = await uranai.update()

        io.to(uranai.socketSlug).emit("/ws/v1/game/response_uranai", {
          target: {slug:player.slug,name:player.name,class:player.class},
          phase: uranai.phase
        })

      }
    })()
  })


  //怪盗の夜の行動
  socket.on("/ws/v1/game/request_kaito",function(change){
    console.log("怪盗",change);
    (async()=>{

      let player = await Player.equalTo("slug", change.targetSlug).fetch()
      let kaito = await Player.equalTo("slug", change.userSlug).fetch()

      kaito.set("phase","NightResult")
      let socketresult = await kaito.update()
      console.log("送ります")
      io.to(kaito.socketSlug).emit("/ws/v1/game/response_kaito", {
        target: {slug:player.slug,name:player.name},
        new_class:player.class,
        phase: kaito.phase
      })

      let tmp = player.class
      player.set("new_class","怪盗")
      socketresult = await player.update()
      kaito.set("new_class",tmp)
      kaito.set("target",player.slug)
      socketresult = await kaito.update()

    })()
  })

  //人狼の夜の行動
  socket.on("/ws/v1/game/request_jinro",function(change){
    console.log("人狼",change);
    (async()=>{

      let jinro = await Player.equalTo("slug", change.userSlug).fetch()
      let players = await Player.equalTo("class", jinro.class).equalTo("roomSlug", change.roomSlug).notEqualTo("slug",change.userSlug).fetchAll()

      jinro.set("phase","NightResult")
      let socketresult = await jinro.update()
      console.log("送ります")

      var mate = []
      for(let player of players){
        mate.push({slug:player.slug,name:player.name})
      }
      jinro.set("target",mate)
      socketresult = await jinro.update()
      io.to(jinro.socketSlug).emit("/ws/v1/game/response_jinro", {
        target: mate,
        phase: jinro.phase
      })

    })()
  })

  //夜の行動の終了
  socket.on("/ws/v1/game/request_night_end",function(change){
    (async()=>{
      console.log("夜の行動終わったって")
      let player = await Player.equalTo("slug", change.userSlug).fetch()
      player.set("phase","NightEnd")
      let socketresult = await player.update()

      let players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      let flag = true
      for(let man of players){
        if(man.phase != "NightEnd"){
          flag = false
        }
      }
      if(flag) {
        console.log("送ります")
        for(let man of players){
          man.set("phase","DayAction")
          let socketresult = await man.update()
          io.to(man.socketSlug).emit("/ws/v1/game/response_night_end", {
            phase: man.phase
          })
        }
      }
    })()
  })


  //昼の行動の終了
  socket.on("/ws/v1/game/request_day_end",function(change){
    (async()=>{
      console.log("昼の行動終わったって")
      let player = await Player.equalTo("slug", change.userSlug).fetch()
      player.set("phase","DayResult")
      player.set("vote",change.targetSlug)
      let socketresult = await player.update()

      let players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      let flag = true
      for(let man of players){
        if(man.phase != "DayResult"){
          flag = false
        }
      }
      if(flag) {
        var voteResult = {}
        let players = await Player.equalTo("roomSlug", change.roomSlug).fetchAll()
        for (let player of players) {
          if (voteResult[player.vote] == undefined) {
            voteResult[player.vote] = 1
          } else {
            voteResult[player.vote] += 1
          }
        }
        console.log(voteResult)
        let maxSlugs = null
        let max = 0
        for (let key in voteResult) {
          if (voteResult[key] > max) {
            max = voteResult[key]
            maxSlugs = [key]
          } else if (voteResult[key] == max) {
            maxSlugs.push(key)
          }
        }

        console.log(maxSlugs)
        let winside = ""

        var executed = []
        console.log(max)
        if(max != 1){
          for (let execute of maxSlugs){
            let person = await Player.equalTo("slug", execute).fetch()
            executed.push(person)
          }
        }


        if(max != 1){
          let heiwa = 0
          for(let peace of players){
            if(peace.class != "人狼"){
              heiwa += 1
            }
          }

          if(heiwa == players.length){
            winside = "なし"
          }else{
            for (let exe of maxSlugs) {
              if (winside != "吊人") {
                let player = await Player.equalTo("slug", exe).fetch()
                if (player.new_class == "吊人") {
                  winside = "吊人"
                  console.log("吊人")
                } else if (player.new_class == "人狼") {
                  winside = "市民"
                  console.log("市民")
                } else {
                  if (winside != "市民") {
                    winside = "人狼"
                    console.log("人狼")
                  }
                }
              }
            }
          }

        }else{
          for(let player of players){
            if(player.new_class == "人狼"){
              winside = "人狼"
              console.log("平和村人狼")
            }
          }
          if(winside != "人狼"){
            winside = "市民"
            console.log("平和村市民")
          }
        }


        let winner = ""
        if(winside == "人狼"){
          winner = await Player.equalTo("roomSlug",change.roomSlug).or([Player.equalTo("new_class","人狼"),Player.equalTo("new_class","狂人")]).fetchAll()
        }else if(winside == "吊人"){
          winner = await Player.equalTo("roomSlug",change.roomSlug).equalTo("new_class","吊人").fetchAll()
        }else if(winside == "なし"){
          winner = ""
        }else{
          winner = await Player.equalTo("roomSlug",change.roomSlug).or([Player.equalTo("new_class","村人"),Player.equalTo("new_class","占い師"),Player.equalTo("new_class","怪盗")]).fetchAll()
        }

        let classroom = await Room.equalTo("slug",change.roomSlug).fetch()
        classroom.set("result",{executed: executed,winside: winside,winner:winner,player:players})
        let socketresult = await classroom.update()

        //ゲーム結果画面に遷移指示
        let result_players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
        for (let man of result_players) {
          man.set("phase", "GameResult")
          let socketresult = await man.update()
          io.to(man.socketSlug).emit("/ws/v1/game/response_game_result", {
          result:{phase: man.phase, executed: executed, winside: winside, winner:winner, player:players}
          })
        }

      }else{
        let vot = await Player.equalTo("slug",player.vote).fetch()
        io.to(player.socketSlug).emit("/ws/v1/game/response_day_end", {
          phase: player.phase,
          vote:{slug:player.vote,name:vot.name}
        })
      }
    })().catch((err)=>{
      console.log(err)
    })
  })


  //投票のキャンセル
  socket.on("/ws/v1/game/request_day_cancel",function(change){
    (async()=>{
      console.log("投票キャンセル")
      let player = await Player.equalTo("slug", change.userSlug).fetch()
      player.set("phase","DayAction")
      player.set("vote","")
      let socketresult = await player.update()
      io.to(player.socketSlug).emit("/ws/v1/game/response_night_end", {
        phase: player.phase
      })

    })().catch((err)=>{
      console.log(err)
    })
  })


  //もう一度ゲームを始める処理
  socket.on("/ws/v1/game/request_new_game",function(change){
    console.log("もう一度ゲームを始めよう",change);
    (async()=>{

      let classroom = await Room.equalTo("slug",change.roomSlug).fetch()
      classroom.set("enableFlag","True")
      let result = await classroom.update()

      //送信処理（全員）
      let finisher = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      for(let player of finisher){
        player.set("phase","GameWaiting")
        result = await player.update()
      }

      let players = await Player.equalTo("roomSlug",change.roomSlug).fetchAll()
      for(let player of players){
        io.to(player.socketSlug).emit("/ws/v1/game/response_new_game",{
          users: players,
          roomSlug: classroom.slug,
          classes: classroom.classes,
          phase: "GameWaiting",
        })
      }
    })()
  })


})









http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
