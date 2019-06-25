<template>
  <div style="padding: 16px;">
    <div>
      <div style="font-size: 2em;">おそろしい夜が明けました．</div>
      話し合って，人狼だと疑わしい人を投票してください．
      <select v-model="target">
        <option value="">-</option>
        <option v-for="user in roomUsers.filter((u)=>{return u.slug != userSlug})" :value="user">{{ user.name }}</option>
      </select>
      <button @click="action()" :disabled="!target">投票</button>
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
      userTarget: function () { return this.$store.getters['user/target'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      socket.on('/ws/v1/game/response_day_end', function(res){
        console.log(res)
        that.$store.commit('user/vote', res.vote)
        that.$store.commit('user/phase', 'DayResult')
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_day_end')
    },
    methods: {
      action () {
        // if (confirm('「'+this.target.name+'」に投票します．よろしいですか？') != false){
        if (true) {
          const socket = this.$store.getters['socket/socket']
          socket.emit('/ws/v1/game/request_day_end', {userSlug: this.userSlug, roomSlug: this.roomSlug, targetSlug: this.target.slug})
        }
      }
    }
  }
</script>