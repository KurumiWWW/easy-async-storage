!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["easy-async-storage"]=t():e["easy-async-storage"]=t()}(self,(()=>(()=>{"use strict";var e={d:(t,r)=>{for(var o in r)e.o(r,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:r[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{eStorage:()=>n});class r{set(e,t){if("string"!=typeof t)throw new Error('Invalid "value" type');return this.storage.setItem(e,t),this}get(e){let t=this.check(e);if(t.status&&t.target)return t.target.getStorage(e);throw new Error(`Cannot find value where key is "${e}"`)}asyncGet(e,t=1e3,r=500){return new Promise(((o,s)=>{let n=0,a=setInterval((()=>{const l=this.get(e);n+=r,l?(clearInterval(a),n=0,o(l)):n>=t&&s(new Error(`Cannot find value where key is "${e}"`))}),r)}))}}class o extends r{constructor(){super(...arguments),this.storage=sessionStorage}keep(){return new s}getStorage(e){const t=sessionStorage.getItem(e);if(null==t)throw new Error(`Cannot find value where key is "${e}"`);return String(t)}check(e){return null!=sessionStorage.getItem(e)?{status:!0,target:this}:null!=localStorage.getItem(e)?{status:!0,target:this.keep()}:{status:!1}}}class s extends r{constructor(){super(...arguments),this.storage=localStorage}unKeep(){return new o}getStorage(e){const t=localStorage.getItem(e);if(null==t)throw new Error(`Cannot find value where key is "${e}"`);return String(t)}check(e){return null!=localStorage.getItem(e)?{status:!0,target:this}:null!=sessionStorage.getItem(e)?{status:!0,target:this.unKeep()}:{status:!1}}}const n=()=>new o;return t})()));