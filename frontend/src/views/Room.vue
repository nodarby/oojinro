<template>
  <div>
    <div>Room {{ roomSlug }}</div>
    <div>User {{ userName }}({{ userSlug }})</div>
  </div>
</template>
<script>
  export default {
    computed: {
      roomSlug: function () {return this.$router.history.current.params.roomSlug},
      userName: function () {return this.$store.getters['user/name']},
      userSlug: function () {return this.$store.getters['user/slug']}
    },
    created: function() {
      // 入室処理
      const that = this
      this.$store.dispatch('room/enter', {roomSlug: this.roomSlug}).then(function(res){

        console.log(res)
      }).catch(function(err){
        that.$router.push({path: '/'})
        alert('部屋が見つかりませんでした')
      })
    }
  }
</script>