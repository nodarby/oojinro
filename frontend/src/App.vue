<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
  import io from 'socket.io-client'
  export default {
    data () {
      return {
        socket: null
      }
    },
    mounted: function () {
      this.socket = io()
      console.log(this.socket)
    }
  }
</script>