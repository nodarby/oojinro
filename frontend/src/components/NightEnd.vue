<template>
  <div style="padding: 16px;">
    <div>
      通信待機中．<br/>
      しばらくお待ちください．
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      roomSlug: function () {return this.$store.getters['room/slug']},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      userPhase: function () { return this.$store.getters['user/phase'] },
      userKlass: function () { return this.$store.getters['user/klass'] },
      userNewKlass: function () { return this.$store.getters['user/newKlass'] },
      userTarget: function () { return this.$store.getters['user/target'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      socket.on('/ws/v1/game/response_night_end', function(res){
        console.log(res)
        that.$store.commit('user/phase', 'DayAction')
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_night_end')
    },
    methods: {
      end () {
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/game/request_night_end', {userSlug: this.userSlug, roomSlug: this.roomSlug})
        this.$store.commit('user/phase', 'NightEnd')
      }
    }
  }
</script>