module.exports=function(e){var n={};function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(i,r,function(n){return e[n]}.bind(null,r));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=10)}([function(e,n){e.exports=flarum.core.compat.app},function(e,n){e.exports=flarum.core.compat.extend},,,,,,,function(e,n){e.exports=flarum.core.compat["components/PermissionGrid"]},,function(e,n,t){"use strict";t.r(n);var i=t(0),r=t.n(i),o=t(1),a=t(8),l=t.n(a);r.a.initializers.add("kilowhat-mailing",function(){Object(o.extend)(l.a.prototype,"moderateItems",function(e){e.add("kilowhat-mailing-all",{icon:"fas fa-envelope",label:r.a.translator.trans("kilowhat-mailing.admin.permissions.mail_all"),permission:"kilowhat-mailing.mail-all"}),e.add("kilowhat-mailing-individual",{icon:"fas fa-envelope",label:r.a.translator.trans("kilowhat-mailing.admin.permissions.mail_individual"),permission:"kilowhat-mailing.mail-individual"})})})}]);
//# sourceMappingURL=admin.js.map