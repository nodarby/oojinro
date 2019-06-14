<template>
  <div style="padding: 16px;">
    <div style="font-size: 2em;">あなたの役職は「{{ userKlass }}」です</div>
    <div>
      <span v-if="userKlass == '占い師'">
        あなたは占い師です．占ったゾォ<br/>
        <span v-if="userTarget.field">
          場を占ったら{{ userTarget.class }}でした<br/>
        </span>
        <span v-else>
          {{ userTarget.name }}は{{ userTarget.class }}でした<br/>
        </span>
          <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '人狼'">
        あなたは人狼です．仲間を見つけたゾォ<br/>
        <span v-for="t in userTarget">{{ t.name }}</span><br/>
        <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '怪盗'">
        あなたは怪盗です．盗んだゾォ<br/>
        {{ userTarget.name }}から{{ userNewKlass }}を奪いました！<br/>
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
      userNewKlass: function () { return this.$store.getters['user/newKlass'] },
      userTarget: function () { return this.$store.getters['user/target'] }
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