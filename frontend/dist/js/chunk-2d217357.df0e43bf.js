(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d217357"],{c66d:function(e,t,r){"use strict";r.r(t);var u=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h1",[e._v("プロフィール")]),r("div",[e._v("ID: "+e._s(e.slug))]),r("div",[e._v("名前: "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.userNameTemp,expression:"userNameTemp"}],attrs:{type:"text"},domProps:{value:e.userNameTemp},on:{input:function(t){t.target.composing||(e.userNameTemp=t.target.value)}}})]),r("input",{attrs:{type:"button",value:"OK"},on:{click:function(t){return e.done()}}})])},n=[],s={data:function(){return{userNameTemp:""}},computed:{slug:function(){return this.$store.getters["user/slug"]}},created:function(){this.userNameTemp=this.$store.getters["user/name"]},methods:{done:function(){var e=this;console.log("Done Edit Profile"),console.log(this.userNameTemp),this.$store.dispatch("user/update",{name:this.userNameTemp}).then(function(){void 0!==e.$router.history.current.query.redirect_to?e.$router.push({path:e.$router.history.current.query.redirect_to}):e.$router.push({path:"/"})}).catch(function(){alert("プロフィールが更新できませんでした")})}}},o=s,i=r("2877"),a=Object(i["a"])(o,u,n,!1,null,null,null);t["default"]=a.exports}}]);
//# sourceMappingURL=chunk-2d217357.df0e43bf.js.map