<template>
  <div id="app" v-if="!isLoading">
    <router-view/>
  </div>
  <div v-else>
    初期化中...
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isLoading: true
      }
    },
    created: function () {
      const that = this
      console.log('Loaded!')
      that.$store.dispatch('user/loginOrSignup').then(function(){
        console.log('Done Login or Signup')
        that.$store.dispatch('socket/connect').then(function(){
          console.log('socketSlugの作成完了')
          that.isLoading = false
        })
      })
    }
  }
</script>