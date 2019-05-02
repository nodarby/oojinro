<template>
  <div class="home">
    <h1>一夜人狼</h1>
    <div>
      <input type="button" value="部屋を作る" @click="createRoom()">
    </div>

    <div>
      <input type="text" v-model="roomSlug">
      <input type="button" value="部屋に入る" @click="findRoom()">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        roomSlug: ''
      }
    },
    methods: {
      createRoom: function () {
        this.$store.dispatch('room/create')
      },
      findRoom: function () {
        this.$store.dispatch('room/enter', {roomSlug: this.roomSlug})
      },
    }
  }
</script>
