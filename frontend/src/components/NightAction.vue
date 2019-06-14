<template>
  <div style="padding: 16px;">
    <div style="font-size: 2em;">あなたの役職は「{{ userKlass }}」です</div>
    <div>
      <span v-if="userKlass == '村人'">
        あなたは村人です．なにもねェ．
      </span>
      <span v-else-if="userKlass == '占い師'">
        あなたは占い師です．占えェ．
        <div v-if="uranaiResult">
          {{ uranaiResult }}でした．乙．
          <button>終わり</button>
        </div>
        <div v-else>
          <select v-model="targetSlug">
            <option value="">-</option>
            <option v-for="user in roomUsers" :value="user.slug">{{ user.name }}</option>
          </select>
          <button @click="action()">占う</button>
        </div>
      </span>
      <span v-else-if="userKlass == '吊人'">
        あなたは吊人です．◯ねぇ．
      </span>
      <span v-else-if="userKlass == '狩人'">
        あなたは狩人です．守れェ．
      </span>
      <span v-else-if="userKlass == '狂人'">
        あなたは狂人です．狂えェ．
      </span>
      <span v-else-if="userKlass == '人狼'">
        あなたは人狼です．殺せェ．
      </span>
      <span v-else-if="userKlass == '怪盗'">
        あなたは怪盗です．盗めェ．
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        targetSlug: '',
        uranaiResult: ''
      }
    },
    computed: {
      roomSlug: function () {return this.$store.getters['room/slug']},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      userPhase: function () { return this.$store.getters['user/phase'] },
      userKlass: function () { return this.$store.getters['user/klass'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      socket.on('/ws/v1/game/response_uranai', function(res){
        console.log(res.targetClass)
        that.uranaiResult = res.targetClass
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_uranai')
    },
    methods: {
      action () {
        if (this.userKlass == '占い師') {
          const socket = this.$store.getters['socket/socket']
          socket.emit('/ws/v1/game/request_uranai', {userSlug: this.userSlug, roomSlug: this.roomSlug, targetSlug: this.targetSlug})
        }
      }
    }
  }
</script>