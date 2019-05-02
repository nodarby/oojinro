<template>
  <div>
    <h1>プロフィール</h1>
    <div>ID: {{slug}}</div>
    <div>名前: <input type="text" v-model="userNameTemp"></div>
    <input type="button" value="OK" @click="done()">
  </div>
</template>
<script>
  export default {
    data () {
      return {
        userNameTemp: ''
      }
    },
    computed: {
      slug: function () {
        return this.$store.getters['user/slug']
      }
    },
    methods: {
      done: function () {
        console.log('Done Edit Profile')
        console.log(this.userNameTemp)
        this.$store.dispatch('user/updateUser', {name: this.userNameTemp})
        /*
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
        */
      }
    }
  }
</script>