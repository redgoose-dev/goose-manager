var L=Object.defineProperty,A=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var x=(t,o,n)=>o in t?L(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,b=(t,o)=>{for(var n in o||(o={}))T.call(o,n)&&x(t,n,o[n]);if(C)for(var n of C(o))$.call(o,n)&&x(t,n,o[n]);return t},B=(t,o)=>A(t,E(o));import{g as z,n as M,u as r,o as s,e as c,f as e,p as f,w as _,t as p,v as g,F as N,x as j,i as h,k as i,j as I,y as P,s as Y,z as q,A as G}from"./vendor.cc7e59d8.js";import{_ as H,s as k,l as J}from"./index.24d3ff97.js";import{_ as y}from"./index.8f90576a.js";import{B as v}from"./basic.604ea11a.js";const K=t=>(q("data-v-67e1e27c"),t=t(),G(),t),O={key:0,class:"layout"},Q={class:"layout-header"},R={class:"layout-header__wrap"},U={class:"layout-header__logo"},W={class:"layout-header__gnb"},X={key:0,class:"navigation"},Z={key:0},ee={class:"layout-header__side"},te={class:"navigation"},oe=p(" Account "),ne=p(" Clear tokens "),se=p(" Logout "),ae={class:"container"},le={class:"container__wrap"},re={class:"layout-footer"},ce={class:"footer__wrap"},ie=K(()=>e("a",{href:"https://redgoose.me",target:"_blank"},"redgoose.me",-1)),de={setup(t){const o=new Date().getFullYear(),n=z(()=>{const{navigation:d}=k.state.preference;return d.map(u=>B(b({},u),{show:u.admin===void 0||u.admin===!0})).filter(u=>!!u.show)});function S(){}function V(){}async function D(){!confirm("\uC815\uB9D0 \uB85C\uADF8\uC544\uC6C3 \uD560\uAE4C\uC694?")||await J()}function m(d){return d.link?"router-link":d.href?"a":"span"}return(d,u)=>{var w;const F=M("router-link");return r(k).state.user?(s(),c("div",O,[e("header",Q,[e("div",R,[e("h1",U,[f(F,{to:"/",title:r(k).state.header.title},{default:_(()=>[p(g(r(k).state.header.shortName),1)]),_:1},8,["title"])]),e("nav",W,[((w=r(n))==null?void 0:w.length)>0?(s(),c("ul",X,[(s(!0),c(N,null,j(r(n),a=>(s(),c("li",null,[(s(),h(I(m(a)),{to:a.link,href:a.href,target:a.target},{default:_(()=>[e("em",null,g(a.name),1),a.icon?(s(),h(y,{key:0,name:a.icon},null,8,["name"])):i("",!0),a.children&&a.children.length?(s(),h(y,{key:1,name:"chevron-down",class:"flip-y dropdown"})):i("",!0)]),_:2},1032,["to","href","target"])),a.children&&a.children.length?(s(),c("div",Z,[e("ol",null,[(s(!0),c(N,null,j(a.children,l=>(s(),c("li",null,[(s(),h(I(m(l)),{to:l.link,href:l.href,target:l.target},{default:_(()=>[e("em",null,g(l.name),1),l.icon?(s(),h(y,{key:0,name:l.icon},null,8,["name"])):i("",!0),l.children&&l.children.length?(s(),h(y,{key:1,name:"chevron-right",class:"dropdown"})):i("",!0)]),_:2},1032,["to","href","target"]))]))),256))])])):i("",!0)]))),256))])):i("",!0)]),e("nav",ee,[e("ul",te,[e("li",null,[e("span",null,[e("em",null,g(r(k).state.user.email),1),f(y,{name:"chevron-down",class:"flip-y"})]),e("div",null,[e("ol",null,[e("li",null,[f(v,{type:"button","icon-left":"user",onClick:S},{default:_(()=>[oe]),_:1})]),e("li",null,[f(v,{type:"button","icon-left":"trash",onClick:P(V,["prevent"])},{default:_(()=>[ne]),_:1},8,["onClick"])]),e("li",null,[f(v,{type:"button","icon-left":"log-out",onClick:D},{default:_(()=>[se]),_:1})])])])])])])])]),e("div",ae,[e("div",le,[Y(d.$slots,"default",{},void 0,!0)])]),e("footer",re,[e("div",ce,[e("address",null,[p(" Copyright \xA9 2014-"+g(r(o))+" ",1),ie])])])])):i("",!0)}}};var ge=H(de,[["__scopeId","data-v-67e1e27c"]]);export{ge as default};
