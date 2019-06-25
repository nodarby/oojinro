<template>
  <div>
    <div style="font-size: 2em">結果: {{ roomResult.winside }}</div>
    <div style="margin-bottom: 1em;">
      <div style="font-size: 2em">勝利者:</div>
      <div v-for="p in roomResult.winner">{{p.name}}</div>
    </div>
    <div style="margin-bottom: 1em;">
      <div style="font-size: 2em">処刑</div>
      <div v-for="p in roomResult.executed">{{p.name}}</div>
    </div>
    <div style="margin-bottom: 1em;">
      <div style="font-size: 2em">プレイヤー</div>
      <div v-for="p in roomResult.player">{{p.name}}
        <span v-if="p.class != p.new_class">{{p.class}} -> {{p.new_class}}</span>
        <span v-else>{{p.class}}</span>
      </div>
    </div>
    <div>
      <a href="javascript: void(0)" v-on:click="retry()">もう一度遊ぶ</a>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      roomSlug: function () {return this.$store.getters['room/slug']},
      roomUsers: function () {return this.$store.getters['room/users']},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']},
      userPhase: function () { return this.$store.getters['user/phase'] },
      userKlass: function () { return this.$store.getters['user/klass'] },
      roomResult: function () { return this.$store.getters['room/result'] }
    },
    methods: {
      retry: function () {
        console.log("もう一度あそぶどーん")

        const socket = this.$store.getters['socket/socket']
        socket.emit('/ws/v1/game/request_new_game', {userSlug: this.userSlug, roomSlug: this.roomSlug})
      }
    }
  }
</script>