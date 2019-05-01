<template>
  <div>
    <div>Room {{ roomName }}</div>
    <div>User {{ userName }}</div>
  </div>
</template>
<script>
  export default {
    computed: {
      roomName: function () {return this.$store.getters['room/name']},
      userName: function () {return this.$store.getters['user/name']}
    },
    created: function () {
      const socket = this.$store.getters['socket/socket']

      // 新しい部屋の名前
      const roomName = this.$router.history.current.params.name

      // 部屋入室の動作
      console.log('entering room:'+roomName)

      // 違う部屋に入っていた場合，そこから退出する
      if (this.roomName !== '' && this.roomName !== roomName)
        socket.emit('requestExitRoom', {uuid: this.$store.getters['user/uuid'], roomName: this.roomName})

      // 新しい部屋に入る
      socket.emit('requestEnterRoom', {uuid: this.$store.getters['user/uuid'], roomName: roomName})

      // 部屋入室の結果受け取り
      const that = this
      socket.once('responseEnterRoom', function (data) {
        if (data !== null){
          // 部屋に入室できた
          that.$store.commit('room/name', roomName)

          console.log("entered room "+roomName)
          console.log(data)

          if (that.$store.getters['user/name'] === '') { // ユーザーの名前が存在しない場合
            console.log('username is not existed')
            that.$router.push({path: '/profile', query: {'redirect_to': '/room/'+roomName}})
            return
          }else{ // ユーザーの名前が存在する場合
            socket.emit('requestUpdateUser', { uuid: this.$store.getters['user/uuid'], roomName: roomName, userName: that.$store.getters['user/name'] })
          }
        }else{
          // 入室できなかった
          console.log('cannot enter room:'+roomName)
          that.$store.commit('room/name', '')
          that.$router.push({path: '/'})
        }
      })
    }
  }
</script>