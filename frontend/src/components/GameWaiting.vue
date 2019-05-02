<template>
  <div>
    <h2>GameWaiting画面</h2>
    <h3>合計: {{ roomClassesSum }}({{roomClassesSum - roomUsers.length}})</h3>
    <ul>
      <li v-for="(value, klass) in roomClasses">{{klass}}×{{ value || 0 }}<button @click="plus(klass)">+</button><button @click="minus(klass)">-</button></li>
    </ul>
    <button>ゲーム開始</button>
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
        // console.log('役職の割り振りが変更されたよ〜', res)
        that.roomClasses = res.classes
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/room/class')
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
      }
    }
  }
</script>