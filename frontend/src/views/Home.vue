<template>
  <div class="home">
    <h1>一夜人狼</h1>
    <div>
      <input type="button" value="部屋を作る" @click="createRoom()">
    </div>

    <div>
      <input type="text" v-model="roomSlugTemp">
      <input type="button" value="部屋に入る" @click="findRoom()">
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
