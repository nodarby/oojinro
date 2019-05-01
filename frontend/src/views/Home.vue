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
        console.log('creating room')
        const socket = this.$store.getters['socket/socket']
        socket.emit('requestRoomName')
        socket.on('responseRoomName', function (data) {
          console.log(data)
        })
        // this.$router.push({path: '/room/'+ ('0000'+Math.floor(Math.random() * 10000)).slice(-4) + ('0000'+Math.floor(Math.random() * 10000)).slice(-4)})
      },
      findRoom: function () {
        console.log('finding room: ' + this.roomName)
      }
    }
  }
</script>
