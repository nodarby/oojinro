(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4813"],{"3ab1":function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.isLoading?s("div",[e._v("\n  入室中...\n")]):s("div",[s("div",[s("div",[e._v("ルーム"+e._s(e.roomSlug))]),s("div",[e._v(e._s(e.userName)+"("+e._s(e.userKlass)+")["+e._s(e.userPhase)+"]")])]),s("div",[s(e.userPhase,{tag:"component"}),s("div",[e._v(e._s(e.userName))]),s("div",[e._v("メンバー")]),s("ul",e._l(e.roomUsers,function(t){return s("li",[e._v(e._s(t.name))])}),0),s("div",[e._v("役職")]),s("ul",e._l(e.roomClasses,function(t,r){return s("li",[e._v(e._s(r)+"×"+e._s(t||0))])}),0),s("router-link",{attrs:{to:"/"}},[e._v("トップページにもどる")])],1)])},o=[],n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",[s("div",{staticStyle:{"font-size":"1.5em"}},[e._v("参加プレイヤー一覧("+e._s(e.roomUsers.length)+"人)")]),e._l(e.roomUsers,function(t){return s("div",{key:t.slug},[s("div",[e._v(e._s(t.name||"[名無しさん]"))])])}),e._m(0)],2),s("div",[s("div",{staticStyle:{"font-size":"1.5em"}},[e._v("役職一覧")]),e._l(e.roomClasses,function(t,r){return s("div",{key:r},[s("div",[e._v(e._s(r)),s("button",{attrs:{color:"blue"},on:{click:function(t){return e.plus(r)}}},[e._v("+")]),s("span",{staticStyle:{width:"50px","text-align":"center",display:"inline-block"}},[e._v(e._s(t||0))]),s("button",{on:{click:function(t){return e.minus(r)}}},[e._v("-")])])])}),s("div",[s("div",[e._v("合計"+e._s(e.roomClassesSum)+"/("+e._s(e.roomClassesSum-e.roomUsers.length)+")")])])],2),s("div",{staticClass:"q-mt-md text-center"},[s("button",{attrs:{disabled:e.roomClassesSum<e.roomUsers.length},on:{click:function(t){return e.gameStart()}}},[e._v("ゲーム開始")])])])},u=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{margin:"1em 0"}},[e._v("\n      名無しさんが表示されている場合は，"),s("a",{attrs:{href:"javascript: location.reload()"}},[e._v("ページの再読み込み")]),e._v("を行なってください．\n    ")])}],i=(s("bc3a"),{computed:{roomClassesSum:function(){if(null!==this.roomClasses){var e=0;for(var t in this.roomClasses)e+=this.roomClasses[t];return e}return 0},roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},roomClasses:{get:function(){return this.$store.getters["room/classes"]},set:function(e){this.$store.commit("room/classes",e)}}},created:function(){var e=this.$store.getters["socket/socket"],t=this;console.log(e),e.on("/ws/v1/room/response_class_change",function(e){console.log("役職の割り振りが変更されたよ〜",e),t.roomClasses=e.classes}),e.on("/ws/v1/game/response_start",function(e){alert("ゲーム開始しました！^^"),t.$store.commit("user/phase","NightAction"),t.$store.commit("user/klass",e.class)})},destroyed:function(){var e=this.$store.getters["socket/socket"];e.off("/ws/v1/room/class"),e.off("/ws/v1/game/response_start")},methods:{plus:function(e){this.roomClasses[e]++;var t=this.$store.getters["socket/socket"];t.emit("/ws/v1/room/request_class_change",{userSlug:this.userSlug,roomSlug:this.roomSlug,classes:this.roomClasses})},minus:function(e){this.roomClasses[e]>0&&this.roomClasses[e]--;var t=this.$store.getters["socket/socket"];t.emit("/ws/v1/room/request_class_change",{userSlug:this.userSlug,roomSlug:this.roomSlug,classes:this.roomClasses})},gameStart:function(){console.log("ゲーム開始リクエスト");var e=this.$store.getters["socket/socket"];e.emit("/ws/v1/game/request_start",{userSlug:this.userSlug,roomSlug:this.roomSlug})}}}),a=i,l=s("2877"),c=Object(l["a"])(a,n,u,!1,null,null,null),g=c.exports,m=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",{staticStyle:{"font-size":"2em"}},[e._v("あなたの役職は「"+e._s(e.userKlass)+"」です")]),s("div",["村人"==e.userKlass?s("span",[e._v("\n      あなたは村人です．"),s("br"),s("button",{on:{click:e.end}},[e._v("朝を迎える")])]):"占い師"==e.userKlass?s("span",[e._v("\n      あなたは占い師です．占えェ．"),s("br"),e._v("\n      占う人:"),s("select",{directives:[{name:"model",rawName:"v-model",value:e.target,expression:"target"}],staticStyle:{display:"inline"},on:{change:function(t){var s=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.target=t.target.multiple?s:s[0]}}},[s("option",{attrs:{value:""}},[e._v("墓場(使われていない役職を占う)")]),e._v("\n      墓地が選択されている場合は，使用されていない役職が選択されます．\n        "),e._l(e.roomUsers.filter(function(t){return t.slug!=e.userSlug}),function(t){return s("option",{domProps:{value:t}},[e._v(e._s(t.name))])})],2),s("br"),s("button",{on:{click:function(t){return e.action()}}},[e._v("項目を占う")])]):"吊人"==e.userKlass?s("span",[e._v("\n      あなたは吊人です．◯ねぇ．"),s("br"),s("button",{on:{click:e.end}},[e._v("朝を迎える")])]):"狂人"==e.userKlass?s("span",[e._v("\n      あなたは狂人です．狂えェ．"),s("br"),s("button",{on:{click:e.end}},[e._v("朝を迎える")])]):"人狼"==e.userKlass?s("span",[e._v("\n      あなたは人狼です．殺せェ．"),s("br"),s("button",{on:{click:function(t){return e.action()}}},[e._v("仲間を見つける")])]):"怪盗"==e.userKlass?s("span",[e._v("\n      あなたは怪盗です．盗めェ．"),s("br"),s("select",{directives:[{name:"model",rawName:"v-model",value:e.target,expression:"target"}],on:{change:function(t){var s=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.target=t.target.multiple?s:s[0]}}},[s("option",{attrs:{value:""}},[e._v("-")]),e._l(e.roomUsers.filter(function(t){return t.slug!=e.userSlug}),function(t){return s("option",{domProps:{value:t}},[e._v(e._s(t.name))])})],2),s("button",{attrs:{disabled:!e.target},on:{click:function(t){return e.action()}}},[e._v("役職を盗む")])]):e._e()])])},v=[],h={data:function(){return{target:""}},computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]}},created:function(){var e=this.$store.getters["socket/socket"],t=this;e.on("/ws/v1/game/response_uranai",function(e){console.log(e),t.$store.commit("user/target",e.target),t.$store.commit("user/phase","NightResult")}),e.on("/ws/v1/game/response_kaito",function(e){console.log(e),t.$store.commit("user/target",e.target),t.$store.commit("user/newKlass",e.new_class),t.$store.commit("user/phase","NightResult")}),e.on("/ws/v1/game/response_jinro",function(e){console.log(e),t.$store.commit("user/target",e.target),t.$store.commit("user/phase","NightResult")})},destroyed:function(){var e=this.$store.getters["socket/socket"];e.off("/ws/v1/game/response_uranai"),e.off("/ws/v1/game/response_kaito"),e.off("/ws/v1/game/response_jinro")},methods:{action:function(){var e=this.$store.getters["socket/socket"];if("占い師"==this.userKlass){console.log(this.target);var t=this.target.slug;this.target||(t=""),e.emit("/ws/v1/game/request_uranai",{userSlug:this.userSlug,roomSlug:this.roomSlug,targetSlug:t})}else if("怪盗"==this.userKlass){console.log(this.target);var s=this.target.slug;e.emit("/ws/v1/game/request_kaito",{userSlug:this.userSlug,roomSlug:this.roomSlug,targetSlug:s})}else"人狼"==this.userKlass&&e.emit("/ws/v1/game/request_jinro",{userSlug:this.userSlug,roomSlug:this.roomSlug})},end:function(){var e=this.$store.getters["socket/socket"];e.emit("/ws/v1/game/request_night_end",{userSlug:this.userSlug,roomSlug:this.roomSlug}),this.$store.commit("user/phase","NightEnd")}}},f=h,_=Object(l["a"])(f,m,v,!1,null,null,null),d=_.exports,p=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",["占い師"==e.userKlass?s("span",{staticStyle:{"font-size":"2em"}},[e.userTarget.field?s("span",[e.userTarget.class.length>0?s("span",[e._v("\n          墓場(使用されていない役職)を占ったら"+e._s(e.userTarget.class)+"でした"),s("br")]):s("span",[e._v("\n          墓場に役職が登録されていませんでした．"),s("br")])]):s("span",[e._v("\n        "+e._s(e.userTarget.name)+"は「"+e._s(e.userTarget.class)+"」でした"),s("br")])]):"人狼"==e.userKlass?s("span",{staticStyle:{"font-size":"2em"}},[e.userTarget.length>0?s("span",[e._l(e.userTarget,function(t){return s("span",[e._v(e._s(t.name))])}),e._v("が仲間です"),s("br")],2):s("span",[e._v("\n        仲間はいないようだ…\n      ")])]):"怪盗"==e.userKlass?s("span",{staticStyle:{"font-size":"2em"}},[e._v("\n      "+e._s(e.userTarget.name)+"から「"+e._s(e.userNewKlass)+"」を奪いました！"),s("br")]):e._e(),s("button",{on:{click:e.end}},[e._v("朝を迎える")])])])},$=[],S={computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]},userNewKlass:function(){return this.$store.getters["user/newKlass"]},userTarget:function(){return this.$store.getters["user/target"]}},methods:{end:function(){var e=this.$store.getters["socket/socket"];e.emit("/ws/v1/game/request_night_end",{userSlug:this.userSlug,roomSlug:this.roomSlug}),this.$store.commit("user/phase","NightEnd")}}},k=S,w=Object(l["a"])(k,p,$,!1,null,null,null),y=w.exports,b=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},K=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",[s("div",{staticStyle:{"font-size":"2em"}},[e._v("他の人の行動を待っています．")]),e._v("\n    通信待機中．"),s("br"),e._v("\n    しばらくお待ちください．\n  ")])])}],N={computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]},userNewKlass:function(){return this.$store.getters["user/newKlass"]},userTarget:function(){return this.$store.getters["user/target"]}}},x=N,C=Object(l["a"])(x,b,K,!1,null,null,null),U=C.exports,z=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",[s("div",{staticStyle:{"font-size":"2em"}},[e._v("おそろしい夜が明けました．")]),e._v("\n    話し合って，人狼だと疑わしい人を投票してください．\n    "),s("select",{directives:[{name:"model",rawName:"v-model",value:e.target,expression:"target"}],on:{change:function(t){var s=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.target=t.target.multiple?s:s[0]}}},[s("option",{attrs:{value:""}},[e._v("-")]),e._l(e.roomUsers.filter(function(t){return t.slug!=e.userSlug}),function(t){return s("option",{domProps:{value:t}},[e._v(e._s(t.name))])})],2),s("button",{attrs:{disabled:!e.target},on:{click:function(t){return e.action()}}},[e._v("投票")])])])},E=[],R=(s("7f7f"),{data:function(){return{target:""}},computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]},userNewKlass:function(){return this.$store.getters["user/newKlass"]},userTarget:function(){return this.$store.getters["user/target"]}},created:function(){var e=this.$store.getters["socket/socket"],t=this;e.on("/ws/v1/game/response_day_end",function(e){console.log(e),t.$store.commit("user/vote",e.vote),t.$store.commit("user/phase","DayResult")})},destroyed:function(){var e=this.$store.getters["socket/socket"];e.off("/ws/v1/game/response_day_end")},methods:{action:function(){if(0!=confirm("「"+this.target.name+"」に投票します．よろしいですか？")){var e=this.$store.getters["socket/socket"];e.emit("/ws/v1/game/request_day_end",{userSlug:this.userSlug,roomSlug:this.roomSlug,targetSlug:this.target.slug})}}}}),j=R,q=Object(l["a"])(j,z,E,!1,null,null,null),P=q.exports,T=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{padding:"16px"}},[s("div",[s("div",{staticStyle:{"font-size":"2em"}},[e._v(e._s(e.userVote.name)+"に投票しました．")]),e._v("\n    通信待機中．"),s("br"),e._v("\n    しばらくお待ちください．\n  ")])])},O=[],A={data:function(){return{target:""}},computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]},userNewKlass:function(){return this.$store.getters["user/newKlass"]},userTarget:function(){return this.$store.getters["user/target"]},userVote:function(){return this.$store.getters["user/vote"]}},created:function(){this.$store.getters["socket/socket"]},destroyed:function(){this.$store.getters["socket/socket"]},methods:{action:function(){if(0!=confirm("「"+this.target.name+"」に投票します．よろしいですか？")){var e=this.$store.getters["socket/socket"];e.emit("/ws/v1/game/request_day_end",{userSlug:this.userSlug,roomSlug:this.roomSlug,targetSlug:this.target.slug})}}}},D=A,G=Object(l["a"])(D,T,O,!1,null,null,null),L=G.exports,J=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticStyle:{"font-size":"2em"}},[e._v("結果: "+e._s(e.roomResult.winside))]),s("div",{staticStyle:{"margin-bottom":"1em"}},[s("div",{staticStyle:{"font-size":"2em"}},[e._v("勝利者:")]),e._l(e.roomResult.winner,function(t){return s("div",[e._v(e._s(t.name))])})],2),s("div",{staticStyle:{"margin-bottom":"1em"}},[s("div",{staticStyle:{"font-size":"2em"}},[e._v("処刑")]),e._l(e.roomResult.executed,function(t){return s("div",[e._v(e._s(t.name))])})],2),s("div",{staticStyle:{"margin-bottom":"1em"}},[s("div",{staticStyle:{"font-size":"2em"}},[e._v("プレイヤー")]),e._l(e.roomResult.player,function(t){return s("div",[e._v(e._s(t.name)+"\n      "),t.class!=t.new_class?s("span",[e._v(e._s(t.class)+" -> "+e._s(t.new_class))]):s("span",[e._v(e._s(t.class))])])})],2)])},V=[],W={computed:{roomSlug:function(){return this.$store.getters["room/slug"]},roomUsers:function(){return this.$store.getters["room/users"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]},roomResult:function(){return this.$store.getters["room/result"]}}},B=W,F=Object(l["a"])(B,J,V,!1,null,null,null),H=F.exports,I={data:function(){return{isLoading:!0}},components:{GameWaiting:g,NightAction:d,NightResult:y,NightEnd:U,DayAction:P,DayResult:L,GameResult:H},computed:{roomSlug:function(){return this.$router.history.current.params.roomSlug},roomUsers:function(){return this.$store.getters["room/users"]},roomClasses:function(){return this.$store.getters["room/classes"]},userName:function(){return this.$store.getters["user/name"]},userSlug:function(){return this.$store.getters["user/slug"]},userPhase:function(){return this.$store.getters["user/phase"]},userKlass:function(){return this.$store.getters["user/klass"]}},created:function(){var e=this;console.log("入室しようとする"),e.$store.dispatch("room/enter",{roomSlug:e.roomSlug}).then(function(t){if(console.log("入室完了",t),e.userName){e.$store.commit("user/newKlass",t.new_class),e.$store.commit("user/klass",t.class),e.$store.commit("user/target",t.target),e.$store.commit("user/phase",t.phase),e.$store.commit("room/result",t.result);var s=e.$store.getters["socket/socket"];s.on("/ws/v1/game/response_night_end",function(t){console.log("夜は明けるだろう…なんどもな…！"),console.log(t),e.$store.commit("user/phase","DayAction")}),s.on("/ws/v1/game/response_game_result",function(t){console.log("昼も終わるだろう…なんどもな！"),console.log(t),e.$store.commit("room/result",t.result),e.$store.commit("user/phase","GameResult")}),e.isLoading=!1}else e.$router.push({path:"/profile",query:{redirect_to:"/room/"+e.roomSlug}})}).catch(function(t){e.$router.push({path:"/"}),alert("部屋が見つかりませんでした")})}},M=I,Q=Object(l["a"])(M,r,o,!1,null,null,null);t["default"]=Q.exports}}]);
//# sourceMappingURL=chunk-2d0c4813.76b42bd2.js.map