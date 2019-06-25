<template>
  <div class="sample">
    <h1>Sample</h1>
    <input type="text" v-model="roomName">
  </div>
</template>
<script>
  export default {
    computed: {
      roomName: {
        get: function () { return this.$store.getters['room/name'] },
        set: function (val) { this.$store.commit('room/name', val) }
      }
    }
  }
</script>