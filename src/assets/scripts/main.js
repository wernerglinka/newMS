parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"qHcZ":[function(require,module,exports) {
"use strict";function e(){for(var e=document.querySelectorAll(".main-menu a"),t=0;t<e.length;t++){var a=e[t];if(a.classList.remove("is-active"),a.href===document.location.href){a.classList.add("is-active");var o=document.location.pathname.replace(/\/$/,""),s=o.substr(o.lastIndexOf("/")+1);""===s&&(s="home"),document.body.classList.add(s)}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e;exports.default=t;
},{}],"Pcqr":[function(require,module,exports) {
"use strict";function t(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=e(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,c=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return c=t.done,t},e:function(t){u=!0,i=t},f:function(){try{c||null==n.return||n.return()}finally{if(u)throw i}}}}function e(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function n(){console.log("loadResponsiveImage");var e,r=t(document.querySelectorAll(".js-progressive-image-wrapper"));try{for(r.s();!(e=r.n()).done;){var n=e.value,o=n.clientWidth,a=n.clientHeight,i=window.devicePixelRatio||1,c="w_".concat(100*Math.round(o*i/100),",h_").concat(100*Math.round(a*i/100),",c_fill,g_auto,f_auto"),u=n.querySelector(".high-res"),l=u.dataset.prefix,f=u.dataset.source;u.src="".concat(l).concat(c,"/").concat(f)}}catch(s){r.e(s)}finally{r.f()}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var o=n;exports.default=o;
},{}],"epB2":[function(require,module,exports) {
"use strict";var e=r(require("./modules/set-active-trail")),u=r(require("./modules/load-responsive-image"));function r(e){return e&&e.__esModule?e:{default:e}}(0,e.default)(),(0,u.default)();
},{"./modules/set-active-trail":"qHcZ","./modules/load-responsive-image":"Pcqr"}]},{},["epB2"], null)
//# sourceMappingURL=/main.js.map