<template>
  <div class="home">
    <h1>一夜人狼</h1>
    <div>
      <div style="font-size: 1.5em">つづきから</div>
      <router-link :to="'/room/'+roomSlug">ルーム{{ roomSlug }}へ</router-link>
    </div>
    <div>
      <div style="font-size: 1.5em">はじめから</div>
      <div>
        <input type="button" value="部屋を作る" @click="createRoom()">
      </div>
      <div>
        <input type="text" v-model="roomSlugTemp" style="display: inline-block"><input type="button" value="部屋に入る" @click="findRoom()" style="display: inline-block">
      </div>
    </div>
    <div>
      <router-link to="/profile">プロフィールの編集</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        roomSlugTemp: ''
      }
    },
    computed: {
      roomSlug: function () {return this.$store.getters['room/slug']}
    },
    methods: {
      createRoom: function () {
        const that = this
        this.$store.dispatch('room/create').then(function(res){
          that.$router.push({path: '/room/'+res.roomSlug})
        }).catch(function(err){
          alert('部屋が作れませんでした')
        })
      },
      findRoom: function () {
        this.$router.push({path: '/room/'+this.roomSlugTemp})
      },
    }
  }
</script>
