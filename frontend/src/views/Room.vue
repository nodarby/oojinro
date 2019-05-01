<template>
  <div>
    <div>Room {{ roomName }}</div>
    <div>User {{ userName }}</div>
  </div>
</template>
<script>
  export default {
    computed: {
      roomName: function () {return this.$store.getters['room/name']},
      userName: function () {return this.$store.getters['user/name']}
    }
  }
</script>