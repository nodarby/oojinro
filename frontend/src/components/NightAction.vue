<template>
  <div style="padding: 16px;">
    <div style="font-size: 2em;">あなたの役職は「{{ userKlass }}」です</div>
    <div>
      <span v-if="userKlass == '村人'">
        あなたは村人です．<br/>
        <button @click="end">朝を迎える</button>
      </span>
      <span v-else-if="userKlass == '占い師'">
        あなたは占い師です．占えェ．<br/>
        占う人:<select v-model="target" style="display: inline">
          <option value="">墓場(使われていない役職を占う)</option>
        墓地が選択されている場合は，使用されていない役職が選択されます．
          <option v-for="user in roomUsers.filter((u)=>{return u.slug != userSlug})" :value="user">{{ user.name }}</option>
        </select><br/>
        <button @click="action()">項目を占う</button>
      </span>
      <span v-else-if="userKlass == '吊人'">
        あなたは吊人です．◯ねぇ．<br/>
        <button @click="end">朝を迎える</button>
      </span>
      <span v-else-if="userKlass == '狂人'">
        あなたは狂人です．狂えェ．<br/>
        <button @click="end">朝を迎える</button>
      </span>
      <span v-else-if="userKlass == '人狼'">
        あなたは人狼です．殺せェ．<br/>
        <button @click="action()">仲間を見つける</button>
      </span>
      <span v-else-if="userKlass == '怪盗'">
        あなたは怪盗です．盗めェ．<br/>
        <select v-model="target">
          <option value="">-</option>
          <option v-for="user in roomUsers.filter((u)=>{return u.slug != userSlug})" :value="user">{{ user.name }}</option>
        </select>
        <button @click="action()" :disabled="!target">役職を盗む</button>
      </span>
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
      userKlass: function () { return this.$store.getters['user/klass'] }
    },
    created: function () {
      // メンバーの変更のソケットを受け付ける
      const socket = this.$store.getters['socket/socket']
      const that = this
      socket.on('/ws/v1/game/response_uranai', function(res){
        console.log(res)
        that.$store.commit('user/target', res.target)
        that.$store.commit('user/phase', 'NightResult')
      })
      socket.on('/ws/v1/game/response_kaito', function(res){
        console.log(res)
        that.$store.commit('user/target', res.target)
        that.$store.commit('user/newKlass', res.new_class)
        that.$store.commit('user/phase', 'NightResult')
      })
      socket.on('/ws/v1/game/response_jinro', function(res){
        console.log(res)
        that.$store.commit('user/target', res.target)
        that.$store.commit('user/phase', 'NightResult')
      })
    },
    destroyed: function () {
      const socket = this.$store.getters['socket/socket']
      socket.off('/ws/v1/game/response_uranai')
      socket.off('/ws/v1/game/response_kaito')
      socket.off('/ws/v1/game/response_jinro')
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
        }else if (this.userKlass == '人狼') {
          socket.emit('/ws/v1/game/request_jinro', {userSlug: this.userSlug, roomSlug: this.roomSlug})
        }
      },
      end () {
        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/game/request_night_end', {userSlug: this.userSlug, roomSlug: this.roomSlug})
        this.$store.commit('user/phase', 'NightEnd')
      }
    }
  }
</script>