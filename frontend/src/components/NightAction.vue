<template>
  <div style="padding: 16px;">
    <div style="font-size: 2em;">あなたの役職は「{{ userKlass }}」です</div>
    <div>
      <span v-if="userKlass == '村人'">
        あなたは村人です．なにもねェ．
          <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '占い師'">
        あなたは占い師です．占えェ．
        <div v-if="targetClass">
          {{ target.name }}は{{ targetClass }}でした．乙．
          <button>終わり</button>
        </div>
        <div v-else-if="fieldClass">
          場にあるカードは{{ fieldClass }}でした．乙．
          <button>終わり</button>
        </div>
        <div v-else>
          <select v-model="target">
            <option value="">場（のこり）</option>
            <option v-for="user in roomUsers.filter((u)=>{return u.slug != userSlug})" :value="user">{{ user.name }}</option>
          </select>
          <button @click="action()">占う</button>
        </div>
      </span>
      <span v-else-if="userKlass == '吊人'">
        あなたは吊人です．◯ねぇ．
        <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '狂人'">
        あなたは狂人です．狂えェ．
        <button>終わり</button>
      </span>
      <span v-else-if="userKlass == '人狼'">
        あなたは人狼です．殺せェ．
        <button>仲間を見つける</button>
      </span>
      <span v-else-if="userKlass == '怪盗'">
        あなたは怪盗です．盗めェ．
        <div v-if="targetClass">
          {{ target.name }}から{{ targetClass }}を奪いました．乙．
          <button>終わり</button>
        </div>
        <div v-else>
          <select v-model="target">
            <option value="">-</option>
            <option v-for="user in roomUsers.filter((u)=>{return u.slug != userSlug})" :value="user">{{ user.name }}</option>
          </select>
          <button @click="action()" :disabled="!target">盗む</button>
        </div>
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        target: '',
        targetClass: '',
        fieldClass: ''
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
        console.log(res)
        if (res.targetClass) that.targetClass = res.targetClass
        if (res.fieldClass) that.fieldClass = res.fieldClass
      })
      socket.on('/ws/v1/game/response_kaito', function(res){
        console.log(res)
        if (res.targetClass) that.targetClass = res.targetClass
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_uranai')
      socket.off('/ws/v1/game/response_kaito')
    },
    methods: {
      action () {
        const socket = this.$store.getters['socket/socket']
        if (this.userKlass == '占い師') {
          console.log(this.target)
          let targetSlug = this.target.slug
          if (!this.target) targetSlug = ''
          socket.emit('/ws/v1/game/request_uranai', {userSlug: this.userSlug, roomSlug: this.roomSlug, targetSlug: targetSlug})
        }else if (this.userKlass == '怪盗') {
          console.log(this.target)
          let targetSlug = this.target.slug
          socket.emit('/ws/v1/game/request_kaito', {userSlug: this.userSlug, roomSlug: this.roomSlug, targetSlug: targetSlug})
        }
      }
    }
  }
</script>