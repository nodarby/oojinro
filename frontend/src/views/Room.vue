<template>
  <div>
    <div>Room {{ roomName }}</div>
    <div>User {{ userName }}({{ uuid }})</div>
  </div>
</template>
<script>
  export default {
    computed: {
      uuid: function () {return this.$store.getters['user/uuid']}
    },
    data () {
      return {
        roomName: '',
        userName: ''
      }
    },
    created: function () {
      const socket = this.$store.getters['socket/socket']

      const oldRoomName = this.$store.getters['room/name']
      const newRoomName = this.$router.history.current.params.name

      // 部屋入室の動作
      console.log('entering room:'+newRoomName)

      // 違う部屋に入っていた場合，そこから退出する
      if (oldRoomName !== '' && oldRoomName !== newRoomName) {
        console.log('oldRoomName:'+ oldRoomName)
        socket.emit('requestExitRoom', {uuid: this.uuid, roomName: oldRoomName})
      }
      // 新しい部屋に入る
      socket.emit('requestEnterRoom', {uuid: this.uuid, roomName: newRoomName})

      // 部屋入室の結果受け取り
      const that = this
      socket.once('responseEnterRoom', function (data) {
        if (data !== null){
          console.log("success entering room "+data.roomName)
          console.log(data)

          // 部屋に入室できた
          that.roomName = data.roomName
          that.$store.commit('room/name', data.roomName)

          // ユーザーの名前の処理
          that.userName = that.$store.getters['user/name']
          if (that.userName === '') { // ユーザーの名前が存在しない場合
            console.log('username is not existed')
            that.$router.push({path: '/profile', query: {'redirect_to': '/room/'+that.roomName}})
            return
          }else{ // ユーザーの名前が存在する場合
            socket.emit('requestUpdateUser', { uuid: that.uuid, roomName: that.roomName, userName: that.userName })
          }
        }else{
          // 入室できなかった
          console.log('failed entering room:'+newRoomName)
          that.$store.commit('room/name', '')
          that.$router.push({path: '/'})
        }
      })
    }
  }
</script>