(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{33:function(e,a,n){e.exports=n(54)},38:function(e,a,n){},39:function(e,a,n){},41:function(e,a,n){},42:function(e,a,n){},54:function(e,a,n){"use strict";n.r(a);var t=n(0),r=n.n(t),c=n(6),o=n.n(c),u=(n(38),n(39),n(31)),i=n(16),l=n(30),m=n(29),s=(n(41),window.innerHeight-50),d=window.innerWidth,g=function(e){var a=e.nuageName;return r.a.createElement("div",null,r.a.createElement("div",{className:"nuage"}),r.a.createElement("div",{className:"surrimage"},r.a.createElement("div",{className:"rimage"},a)))},f=function(e){var a=e.nuageName,n=null;return Object(t.useEffect)(function(){var e=Math.floor(Math.random()*s),a=Math.floor(Math.random()*d);m.a.to(n,3,{x:a,y:e})},[a]),r.a.createElement("div",{ref:function(e){return n=e},className:"cumulus"},r.a.createElement(g,{nuageName:a}))},v=n(82),h=(n(42),function(){var e=r.a.useState({clouds:[],nuageName:""}),a=Object(l.a)(e,2),n=a[0],t=a[1];return r.a.createElement("div",{className:"ciel"},r.a.createElement("form",{onSubmit:function(e){e.preventDefault();var a=n.nuageName.split("age");a.length>1&&""===a[a.length-1]?function(e){var a=[].concat(Object(i.a)(n.clouds),[e]);t({nuageName:"",clouds:a})}(n.nuageName):alert("ce mot ne rime pas avec age")},className:"dessinage"},r.a.createElement(v.a,{onChange:function(e){t(Object(u.a)({},n,{nuageName:e.target.value}))},value:n.nuageName})),n.clouds.map(function(e,a){return r.a.createElement(f,{key:e,nuageName:e})}))});var N=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(h,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(N,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[33,1,2]]]);
//# sourceMappingURL=main.2fc82a96.chunk.js.map