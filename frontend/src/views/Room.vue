<template>
  <div v-if="!isLoading">
    <div>
      <div>ルーム{{ roomSlug }}</div>
      <div>{{ userName }}({{ userKlass }})[{{ userPhase }}]</div>
    </div>
    <div>
      <component :is="userPhase"></component>
      <div>{{ userName }}({{ userSlug }})</div>
      <div>メンバー</div>
      <ul>
        <li v-for="roomUser in roomUsers">{{roomUser.name}}({{roomUser.slug}})</li>
      </ul>
      <div>役職</div>
      <ul>
        <li v-for="(value, klass) in roomClasses">{{klass}}×{{ value || 0 }}</li>
      </ul>
    </div>
  </div>
  <div v-else>
    入室中...
  </div>
</template>
<script>
  import GameWaiting from '../components/GameWaiting'
  import NightAction from '../components/NightAction'
  import NightResult from '../components/NightResult'

  export default {
    data () {
      return {
        isLoading: true
      }
    },
    components: {
      GameWaiting,
      NightAction,
      NightResult
    },
    computed: {
      roomSlug: function () {return this.$router.history.current.params.roomSlug},
      roomUsers: function () {return this.$store.getters['room/users']},
      roomClasses: function () {return this.$store.getters['room/classes']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      userPhase: function () { return this.$store.getters['user/phase'] },
      userKlass: function () { return this.$store.getters['user/klass'] }
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
          that.$store.commit('user/newKlass', res.new_class)
          that.$store.commit('user/klass', res.class)
          that.$store.commit('user/target', res.target)
          that.$store.commit('user/phase', res.phase)
          // 画面を見せる
          that.isLoading = false
        }).catch(function(err){
          that.$router.push({path: '/'})
          alert('部屋が見つかりませんでした')
        })
    }
  }
</script>