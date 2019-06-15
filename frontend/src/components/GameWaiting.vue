<template>
  <div style="padding: 16px;">
    <div>
      <div style="font-size: 1.5em;">参加プレイヤー一覧({{ roomUsers.length }}人)</div>
      <div v-for="roomUser in roomUsers" :key="roomUser.slug">
        <div>{{ roomUser.name || '[名無しさん]' }}</div>
      </div>
      名無しさんが表示されている場合は，<a href="javascript: location.reload()">ページの再読み込み</a>を行なってください．
    </div>
    <div>
      <div style="font-size: 1.5em;">役職一覧</div>
      <div v-for="(value, klass) in roomClasses" :key="klass">
        <div>{{ klass }}<button color="blue" @click="plus(klass)">+</button><span style="width: 50px;text-align: center;display: inline-block;">{{ value || 0 }}</span><button @click="minus(klass)">-</button></div>
      </div>
      <div>
        <div>合計{{ roomClassesSum }}/({{roomClassesSum - roomUsers.length}})</div>
      </div>
    </div>
    <div class="q-mt-md text-center">
      <button @click="gameStart()" :disabled="roomClassesSum < roomUsers.length">ゲーム開始</button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    computed: {
      roomClassesSum: function () {
        if (this.roomClasses !== null){
          let sum = 0
          for(let klass in this.roomClasses)
            sum += this.roomClasses[klass]
          return sum
        }else
          return 0
      },
      roomSlug: function () {return this.$store.getters['room/slug']},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      roomClasses: {
        get: function () { return this.$store.getters['room/classes']},
        set: function (value) { this.$store.commit('room/classes', value) }
      }
  },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      console.log(socket)

      socket.on('/ws/v1/room/response_class_change', function(res){
        console.log('役職の割り振りが変更されたよ〜', res)
        that.roomClasses = res.classes
      })
      socket.on('/ws/v1/game/response_start', function(res){
        alert('ゲーム開始しました！^^')
        that.$store.commit('user/phase', 'NightAction')
        that.$store.commit('user/klass', res.class)
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/room/class')
      socket.off('/ws/v1/game/response_start')
    },
    methods: {
      plus: function (klass){
        this.roomClasses[klass] ++
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/room/request_class_change', {userSlug: this.userSlug, roomSlug: this.roomSlug, classes: this.roomClasses})
      },
      minus: function (klass){
        if (this.roomClasses[klass] > 0) this.roomClasses[klass] --
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/room/request_class_change', {userSlug: this.userSlug, roomSlug: this.roomSlug, classes: this.roomClasses})
      },
      gameStart: function (){
        console.log('ゲーム開始リクエスト')
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/game/request_start', {userSlug: this.userSlug, roomSlug: this.roomSlug})
      }
    }
  }
</script>