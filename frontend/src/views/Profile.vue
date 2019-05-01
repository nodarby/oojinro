<template>
  <div>
    あなたの名前は？？
    <input type="text" v-model="userName">
    <input type="button" value="OK" @click="done()">
  </div>
</template>
<script>
  export default {
    computed: {
      userName: {
        get: function () { return this.$store.getters['user/name'] },
        set: function (value) { this.$store.commit('user/name', value) }
      }
    },
    methods: {
      done: function () {
        if (this.$router.history.current.query.redirect_to !== undefined){
          this.$router.push({path: this.$router.history.current.query.redirect_to})
        }else{
          this.$router.push({path: '/'})
        }
      }
    }
  }
</script>