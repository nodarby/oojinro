<template>
  <div>
    あなた({{ uuid }})の名前は？？
    <input type="text" v-model="userName">
    <input type="button" value="OK" @click="done()">
    現在のルーム: {{ roomName }}
  </div>
</template>
<script>
  export default {
    computed: {
      userName: {
        get: function () { return this.$store.getters['user/name'] },
        set: function (value) { this.$store.commit('user/name', value) }
      },
      uuid: function () {
        return this.$store.getters['user/uuid']
      },
      roomName: function () {
        return this.$store.getters['room/name']
      }
    },
    methods: {
      done: function () {
        if (this.$router.history.current.query.redirect_to !== undefined){
          // ルームに所属しているならば，ルームの情報も更新
          if (this.roomName !== ''){
            const socket = this.$store.getters['socket/socket']
            socket.emit('requestUpdateUser', { uuid: this.uuid, roomName: this.roomName, userName: this.userName })
          }
          this.$router.push({path: this.$router.history.current.query.redirect_to})
        }else{
          this.$router.push({path: '/'})
        }
      }
    }
  }
</script>