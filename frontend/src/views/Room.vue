<template>
  <div v-if="!isLoading">
    <div>
      <div>ルーム{{ roomSlug }}</div>
      <div>{{ userName }}<span v-if="userKlass">({{ userKlass }})</span></div>
    </div>
    <div>
      <component :is="userPhase"></component>
      <div>{{ userName }}</div>
      <div>メンバー</div>
      <ul>
        <li v-for="roomUser in roomUsers">{{roomUser.name}}</li>
      </ul>
      <div>役職</div>
      <ul>
        <li v-for="(value, klass) in roomClasses">{{klass}}×{{ value || 0 }}</li>
      </ul>
      <router-link to="/">トップページにもどる</router-link>
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
  import NightEnd from '../components/NightEnd'
  import DayAction from '../components/DayAction'
  import DayResult from '../components/DayResult'
  import GameResult from '../components/GameResult'

  export default {
    data () {
      return {
        isLoading: true
      }
    },
    components: {
      GameWaiting,
      NightAction,
      NightResult,
      NightEnd,
      DayAction,
      DayResult,
      GameResult
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
          that.$store.commit('room/result', res.result)

          const socket = that.$store.getters['socket/socket']
          socket.on('/ws/v1/game/response_night_end', function(res){
            console.log('夜は明けるだろう…なんどもな…！')
            console.log(res)
            that.$store.commit('user/phase', 'DayAction')
          })
          socket.on('/ws/v1/game/response_game_result', function(res){
            console.log('昼も終わるだろう…なんどもな！')
            console.log(res)
            that.$store.commit('room/result', res.result)
            that.$store.commit('user/phase', 'GameResult')
          })
          socket.on('/ws/v1/room/name_change', function(res){
            console.log("ユーザー情報が変わりました")
            console.log(res.users)
            that.$store.commit('room/users', res.users)
          })

          socket.on('/ws/v1/game/response_new_game', function(res){
            console.log("新しいゲームが始まりました！")
            console.log(res)

            that.$store.commit('room/slug', res.roomSlug)
            that.$store.commit('room/users', res.users)
            that.$store.commit('room/classes', res.classes)
            that.$store.commit('user/phase', res.phase, {root: true})
            that.$store.commit('user/klass', null, {root: true})
          })

          // 画面を見せる
          that.isLoading = false
        }).catch(function(err){
          that.$router.push({path: '/'})
          alert('部屋が見つからない．またはゲームをプレイ中です．')
        })
    }
  }
</script>