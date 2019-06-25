<template>
  <div style="padding: 16px;">
    <div>
      <div style="font-size: 2em;">{{ userVote.name }}に投票しました．</div>
      通信待機中．<br/>
      しばらくお待ちください．
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        target: ''
      }
    },
    computed: {
      roomSlug: function () {return this.$store.getters['room/slug']},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      userPhase: function () { return this.$store.getters['user/phase'] },
      userKlass: function () { return this.$store.getters['user/klass'] },
      userNewKlass: function () { return this.$store.getters['user/newKlass'] },
      userTarget: function () { return this.$store.getters['user/target'] },
      userVote: function () { return this.$store.getters['user/vote'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
    },
    methods: {
      action () {
        if (confirm('「'+this.target.name+'」に投票します．よろしいですか？') != false){
          const socket = this.$store.getters['socket/socket']
          socket.emit('/ws/v1/game/request_day_end', {userSlug: this.userSlug, roomSlug: this.roomSlug, targetSlug: this.target.slug})
        }
      }
    }
  }
</script>