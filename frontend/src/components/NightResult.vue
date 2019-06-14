<template>
  <div style="padding: 16px;">
    <div style="font-size: 2em;">あなたの役職は「{{ userKlass }}」です</div>
    <div>
      あだー:{{ userOthers }}<br/>
      <span v-if="userKlass == '占い師'">
        あなたは占い師です．占ったゾォ
          <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '人狼'">
        あなたは人狼です．仲間を見つけたゾォ
          <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '怪盗'">
        あなたは怪盗です．盗んだゾォ
          <button>終わり</button>
      </span>
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
      userOthers: function () { return this.$store.getters['user/others'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      socket.on('/ws/v1/game/response_night_end', function(res){
        console.log(res)
        that.$store.commit('user/phase', 'NightEnd')
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_night_end')
    },
    methods: {
      action () {
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/game/request_night_end', {userSlug: this.userSlug, roomSlug: this.roomSlug})
      }
    }
  }
</script>