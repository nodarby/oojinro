(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4813"],{"3ab1":function(e,o,t){"use strict";t.r(o);var r=function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",[t("div",[e._v("Room "+e._s(e.roomName))]),t("div",[e._v("User "+e._s(e.userName))])])},s=[],n=(t("7f7f"),{computed:{roomName:function(){return this.$store.getters["room/name"]},userName:function(){return this.$store.getters["user/name"]}},created:function(){var e=this.$store.getters["socket/socket"],o=this.$router.history.current.params.name;console.log("entering room:"+o),""!==this.roomName&&this.roomName!==o&&e.emit("requestExitRoom",{uuid:this.$store.getters["user/uuid"],roomName:this.roomName}),e.emit("requestEnterRoom",{uuid:this.$store.getters["user/uuid"],roomName:o});var t=this;e.once("responseEnterRoom",function(r){if(null!==r){if(t.$store.commit("room/name",o),console.log("entered room "+o),console.log(r),""===t.$store.getters["user/name"])return console.log("username is not existed"),void t.$router.push({path:"/profile",query:{redirect_to:"/room/"+o}});e.emit("requestUpdateUser",{uuid:this.$store.getters["user/uuid"],roomName:o,userName:t.$store.getters["user/name"]})}else console.log("cannot enter room:"+o),t.$store.commit("room/name",""),t.$router.push({path:"/"})})}}),u=n,m=t("2877"),i=Object(m["a"])(u,r,s,!1,null,null,null);o["default"]=i.exports}}]);
//# sourceMappingURL=chunk-2d0c4813.5dc86ac2.js.map