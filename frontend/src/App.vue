<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    mounted: function () {
      this.$store.commit('socket/connect')
      this.$store.commit('user/uuid')
    }
  }
</script>