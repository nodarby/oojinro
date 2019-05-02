<template>
  <div>
    <h1>プロフィール</h1>
    <div>ID: {{slug}}</div>
    <div>名前: <input type="text" v-model="userNameTemp"></div>
    <input type="button" value="OK" @click="done()">
  </div>
</template>
<script>
  export default {
    data () {
      return {
        userNameTemp: ''
      }
    },
    computed: {
      slug: function () {
        return this.$store.getters['user/slug']
      }
    },
    created: function () {
      this.userNameTemp = this.$store.getters['user/name']
    },
    methods: {
      done: function () {
        const that = this
        console.log('Done Edit Profile')
        console.log(this.userNameTemp)
        this.$store.dispatch('user/update', {name: this.userNameTemp}).then(function(){
          if (that.$router.history.current.query.redirect_to !== undefined){
            that.$router.push({path: that.$router.history.current.query.redirect_to})
          }else{
            that.$router.push({path: '/'})
          }
        }).catch(function(){
          alert('プロフィールが更新できませんでした')
        })
      }
    }
  }
</script>