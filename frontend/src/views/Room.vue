<template>
  <div v-if="!isLoading">
    <div>Room {{ roomSlug }}</div>
    <div>User {{ userName }}({{ userSlug }})</div>
    <ul v-for="roomUser in roomUsers">
      <li>{{roomUser.name}}({{roomUser.slug}})</li>
    </ul>
  </div>
  <div v-else>
    Loading...
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isLoading: true
      }
    },
    computed: {
      roomSlug: function () {return this.$router.history.current.params.roomSlug},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']}
    },
    created: function() {
      // 入室処理
      const that = this
        console.log('入室しようとする')
        that.$store.dispatch('room/enter', {roomSlug: that.roomSlug}).then(function(res){
          console.log('入室完了', res)
          if(!that.userName){
            that.$router.push({path: '/profile', query: {redirect_to: '/room/'+that.roomSlug}})
            return
          }
          // 画面を見せる
          that.isLoading = false
        }).catch(function(err){
          that.$router.push({path: '/'})
          alert('部屋が見つかりませんでした')
        })
    }
  }
</script>