<template>
  <div v-if="!isLoading">
    <h1>ルーム{{ roomSlug }}</h1>
    <h3>{{ userName }}({{ userSlug }})</h3>
    <h2>メンバー</h2>
    <ul>
      <li v-for="roomUser in roomUsers">{{roomUser.name}}({{roomUser.slug}})</li>
    </ul>
    <h2>役職</h2>
    <ul>
      <li v-for="(value, klass) in roomClasses">{{klass}}×{{ value || 0 }}</li>
    </ul>
    <GameWaiting></GameWaiting>
  </div>
  <div v-else>
    入室中...
  </div>
</template>
<script>
  import GameWaiting from '../components/GameWaiting'

  export default {
    data () {
      return {
        isLoading: true
      }
    },
    components: {
      GameWaiting
    },
    computed: {
      roomSlug: function () {return this.$router.history.current.params.roomSlug},
      roomUsers: function () {return this.$store.getters['room/users']},
      roomClasses: function () {return this.$store.getters['room/classes']},
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