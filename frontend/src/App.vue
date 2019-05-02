<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    created: function () {
      const that = this
      console.log('Loaded!')
      that.$store.dispatch('user/loginOrSignup').then(function(){
        console.log('Done Login or Signup')
        that.$store.commit('socket/connect')
      })
    }
  }
</script>