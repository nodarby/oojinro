<template>
  <div class="home">
    <h1>一夜人狼</h1>
    <div>
      <input type="button" value="部屋を作る" @click="createRoom()">
    </div>

    <div>
      <input type="text" v-model="roomName">
      <input type="button" value="部屋に入る" @click="findRoom()">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        roomName: ''
      }
    },
    methods: {
      createRoom: function () {
        const that = this
        console.log('creating room')
        const socket = this.$store.getters['socket/socket']
        // 部屋を作る動作
        console.log(this.$store.getters['user/uuid'])
        socket.emit('requestCreateRoom', this.$store.getters['user/uuid'])
        // 部屋を作り終えたら
        socket.once('responseCreateRoom', function (roomName) {
          // 部屋に入る
          that.$router.push({path: '/room/'+roomName})
        })
      },
      findRoom: function () {
        console.log('finding room: ' + this.roomName)
        // 部屋に入る処理
        this.$router.push({path: '/room/'+this.roomName})
      }
    }
  }
</script>
