globalThis.process ??= {}; globalThis.process.env ??= {};
var n,l$1,u$1,t,i$1,r,o$1,e,f$1,c$1,a$1,s$1,h$1,p$1,v$1,d$1={},w$1=[],_$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,g$1=Array.isArray;function m$1(n,l){for(var u in l)n[u]=l[u];return n}function b$1(n){n&&n.parentNode&&n.parentNode.removeChild(n);}function k$1(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps) void 0===e[o]&&(e[o]=l.defaultProps[o]);return x$1(l,e,i,r,null)}function x$1(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++u$1:o,__i:-1,__u:0};return null==o&&null!=l$1.vnode&&l$1.vnode(e),e}function S$1(n){return n.children}function C$1(n,l){this.props=n,this.context=l;}function $$1(n,l){if(null==l)return n.__?$$1(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?$$1(n):null}function I$1(n){if(n.__P&&n.__d){var u=n.__v,t=u.__e,i=[],r=[],o=m$1({},u);o.__v=u.__v+1,l$1.vnode&&l$1.vnode(o),q$1(n.__P,o,u,n.__n,n.__P.namespaceURI,32&u.__u?[t]:null,i,null==t?$$1(u):t,!!(32&u.__u),r),o.__v=u.__v,o.__.__k[o.__i]=o,D$1(i,o,r),u.__e=u.__=null,o.__e!=t&&P$1(o);}}function P$1(n){if(null!=(n=n.__)&&null!=n.__c)return n.__e=n.__c.base=null,n.__k.some(function(l){if(null!=l&&null!=l.__e)return n.__e=n.__c.base=l.__e}),P$1(n)}function A$1(n){(!n.__d&&(n.__d=true)&&i$1.push(n)&&!H$1.__r++||r!=l$1.debounceRendering)&&((r=l$1.debounceRendering)||o$1)(H$1);}function H$1(){try{for(var n,l=1;i$1.length;)i$1.length>l&&i$1.sort(e),n=i$1.shift(),l=i$1.length,I$1(n);}finally{i$1.length=H$1.__r=0;}}function L$1(n,l,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,_,g=t&&t.__k||w$1,m=l.length;for(f=T$1(u,l,g,f,m),s=0;s<m;s++)null!=(p=u.__k[s])&&(h=-1!=p.__i&&g[p.__i]||d$1,p.__i=s,_=q$1(n,p,h,i,r,o,e,f,c,a),v=p.__e,p.ref&&h.ref!=p.ref&&(h.ref&&J(h.ref,null,p),a.push(p.ref,p.__c||v,p)),null==y&&null!=v&&(y=v),4&p.__u?(f=j$1(p,f,n),h.__e&&(h.__e=null)):"function"==typeof p.type&&void 0!==_?f=_:v&&(f=v.nextSibling),p.__u&=-7);return u.__e=y,f}function T$1(n,l,u,t,i){var r,o,e,f,c,a=u.length,s=a,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?("string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?o=n.__k[r]=x$1(null,o,null,null,null):g$1(o)?o=n.__k[r]=x$1(S$1,{children:o},null,null,null):void 0===o.constructor&&o.__b>0?o=n.__k[r]=x$1(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):n.__k[r]=o,f=r+h,o.__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=O(o,u,f,s))&&(s--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>a?h--:i<a&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(s)for(r=0;r<a;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=$$1(e)),K(e,e));return t}function j$1(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=j$1(t[i],l,u));return l}n.__e!=l&&(l&&n.type&&!l.parentNode&&(l=$$1(n)),l=u.insertBefore(n.__e,l||null));do{l=l&&l.nextSibling;}while(null!=l&&8==l.nodeType);return l}function O(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],a=null!=c&&0==(2&c.__u);if(null===c&&null==e||a&&e==c.key&&f==c.type)return u;if(t>(a?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return  -1}function z(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||_$1.test(l)?u:u+"px";}function N$1(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||z(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||z(n.style,l,u[l]);}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(s$1,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u[a$1]=t[a$1]:(u[a$1]=h$1,n.addEventListener(l,r?v$1:p$1,r)):n.removeEventListener(l,r?v$1:p$1,r);else {if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||false===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u));}}function V$1(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u[c$1])u[c$1]=h$1++;else if(u[c$1]<t[a$1])return;return t(l$1.event?l$1.event(u):u)}}}function q$1(n,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,d,_,k,x,M,I,P,A,H,T,j,F=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(s=l$1.__b)&&s(u);n:if("function"==typeof F){h=e.length;try{if(x=u.props,M=F.prototype&&F.prototype.render,I=(s=F.contextType)&&i[s.__c],P=s?I?I.props.value:s.__:i,t.__c?k=(p=u.__c=t.__c).__=p.__E:(M?u.__c=p=new F(x,P):(u.__c=p=new C$1(x,P),p.constructor=F,p.render=Q),I&&I.sub(p),p.state||(p.state={}),p.__n=i,v=p.__d=!0,p.__h=[],p._sb=[]),M&&null==p.__s&&(p.__s=p.state),M&&null!=F.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=m$1({},p.__s)),m$1(p.__s,F.getDerivedStateFromProps(x,p.__s))),y=p.props,d=p.state,p.__v=u,v)M&&null==F.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),M&&null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else {if(M&&null==F.getDerivedStateFromProps&&x!==y&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(x,P),u.__v==t.__v||!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(x,p.__s,P)){u.__v!=t.__v&&(p.props=x,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u);}),w$1.push.apply(p.__h,p._sb),p._sb=[],p.__h.length&&e.push(p),f=$$1(t);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(x,p.__s,P),M&&null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(y,d,_);});}if(p.context=P,p.props=x,p.__P=n,p.__e=!1,A=l$1.__r,H=0,M)p.state=p.__s,p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),w$1.push.apply(p.__h,p._sb),p._sb=[];else do{p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),p.state=p.__s;}while(p.__d&&++H<25);p.state=p.__s,null!=p.getChildContext&&(i=m$1(m$1({},i),p.getChildContext())),M&&!v&&null!=p.getSnapshotBeforeUpdate&&(_=p.getSnapshotBeforeUpdate(y,d)),T=null!=s&&s.type===S$1&&null==s.key?E$1(s.props.children):s,f=L$1(n,g$1(T)?T:[T],u,t,i,r,o,e,f,c,a),p.base=u.__e,u.__u&=-161,p.__h.length&&e.push(p),k&&(p.__E=p.__=null);}catch(n){if(e.length=h,u.__v=null,c||null!=o){if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;null!=o&&(o[o.indexOf(f)]=null),u.__e=f;}else if(null!=o)for(j=o.length;j--;)b$1(o[j]);}else u.__e=t.__e;null==u.__k&&(u.__k=t.__k||[]),n.then||B$1(u),l$1.__e(n,u,t);}}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=G(t.__e,u,t,i,r,o,e,c,a);return (s=l$1.diffed)&&s(u),128&u.__u?void 0:f}function B$1(n){n&&(n.__c&&(n.__c.__e=true),n.__k&&n.__k.some(B$1));}function D$1(n,u,t){for(var i=0;i<t.length;i++)J(t[i],t[++i],t[++i]);l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function E$1(n){return "object"!=typeof n||null==n||n.__b>0?n:g$1(n)?n.map(E$1):void 0!==n.constructor?null:m$1({},n)}function G(u,t,i,r,o,e,f,c,a){var s,h,p,v,y,w,_,m=i.props||d$1,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(s=0;s<e.length;s++)if((y=e[s])&&"setAttribute"in y==!!x&&(x?y.localName==x:3==y.nodeType)){u=y,e[s]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(l$1.__m&&l$1.__m(t,e),c=false),e=null;}if(null==x)m===k||c&&u.data==k||(u.data=k);else {if(e="textarea"==x&&null!=k.defaultValue?null:e&&n.call(u.childNodes),!c&&null!=e)for(m={},s=0;s<u.attributes.length;s++)m[(y=u.attributes[s]).name]=y.value;for(s in m)y=m[s],"dangerouslySetInnerHTML"==s?p=y:"children"==s||s in k||"value"==s&&"defaultValue"in k||"checked"==s&&"defaultChecked"in k||N$1(u,s,null,y,o);for(s in k)y=k[s],"children"==s?v=y:"dangerouslySetInnerHTML"==s?h=y:"value"==s?w=y:"checked"==s?_=y:c&&"function"!=typeof y||m[s]===y||N$1(u,s,y,m[s],o);if(h)c||p&&(h.__html==p.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(p&&(u.innerHTML=""),L$1("template"==t.type?u.content:u,g$1(v)?v:[v],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&$$1(i,0),c,a),null!=e)for(s=e.length;s--;)b$1(e[s]);c&&"textarea"!=x||(s="value","progress"==x&&null==w?u.removeAttribute("value"):null!=w&&(w!==u[s]||"progress"==x&&!w||"option"==x&&w!=m[s])&&N$1(u,s,w,m[s],o),s="checked",null!=_&&_!=u[s]&&N$1(u,s,_,m[s],o));}return u}function J(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u));}else n.current=u;}catch(n){l$1.__e(n,t);}}function K(n,u,t){var i,r;if(l$1.unmount&&l$1.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||J(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$1.__e(n,u);}i.base=i.__P=i.__n=null;}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&K(i[r],u,t||"function"!=typeof n.type);t||b$1(n.__e),n.__c=n.__=n.__e=void 0;}function Q(n,l,u){return this.constructor(n,u)}n=w$1.slice,l$1={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l;}throw n}},u$1=0,t=function(n){return null!=n&&void 0===n.constructor},C$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=m$1({},this.state),"function"==typeof n&&(n=n(m$1({},u),this.props)),n&&m$1(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),A$1(this));},C$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=true,n&&this.__h.push(n),A$1(this));},C$1.prototype.render=S$1,i$1=[],o$1="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,e=function(n,l){return n.__v.__b-l.__v.__b},H$1.__r=0,f$1=Math.random().toString(8),c$1="__d"+f$1,a$1="__a"+f$1,s$1=/(PointerCapture)$|Capture$/i,h$1=0,p$1=V$1(false),v$1=V$1(true);

var o="__s",i="__c",a="__k",u="__d",c="__s",f=/[\s\n\\/='"\0<>]/,s=/^(xlink|xmlns|xml)([A-Z])/,l=/^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/,p=/^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/,h=new Set(["draggable","spellcheck"]);function d(e){ void 0!==e.__g?e.__g|=8:e[u]=true;}function v(e){ void 0!==e.__g?e.__g&=-9:e[u]=false;}function m(e){return void 0!==e.__g?!!(8&e.__g):true===e[u]}var y=/["&<]/;function _(e){if(0===e.length||false===y.test(e))return e;for(var t=0,n=0,r="",o="";n<e.length;n++){switch(e.charCodeAt(n)){case 34:o="&quot;";break;case 38:o="&amp;";break;case 60:o="&lt;";break;default:continue}n!==t&&(r+=e.slice(t,n)),r+=o,t=n+1;}return n!==t&&(r+=e.slice(t,n)),r}var g={},k=new Set(["animation-iteration-count","border-image-outset","border-image-slice","border-image-width","box-flex","box-flex-group","box-ordinal-group","column-count","fill-opacity","flex","flex-grow","flex-negative","flex-order","flex-positive","flex-shrink","flood-opacity","font-weight","grid-column","grid-row","line-clamp","line-height","opacity","order","orphans","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","widows","z-index","zoom"]),b=/[A-Z]/g;function x(e){var t="";for(var n in e){var r=e[n];if(null!=r&&""!==r){var o="-"==n[0]?n:g[n]||(g[n]=n.replace(b,"-$&").toLowerCase()),i=";";"number"!=typeof r||o.startsWith("--")||k.has(o)||(i="px;"),t=t+o+":"+r+i;}}return t||void 0}function w(){this.__d=true;}function H(e,t){return {__v:e,context:t,props:e.props,setState:w,forceUpdate:w,__d:true,__h:new Array(0)}}function C(e,t,n){if(!e.s){if(n instanceof D){if(!n.s)return void(n.o=C.bind(null,e,t));1&t&&(t=n.s),n=n.v;}if(n&&n.then)return void n.then(C.bind(null,e,t),C.bind(null,e,2));e.s=t,e.v=n;const r=e.o;r&&r(e);}}var D=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,o=this.s;if(o){var i=1&o?t:n;if(i){try{C(r,1,i(this.v));}catch(e){C(r,2,e);}return r}return this}return this.o=function(e){try{var o=e.v;1&e.s?C(r,1,t?t(o):o):n?C(r,1,n(o)):C(r,2,o);}catch(e){C(r,2,e);}},r},e}();function A(e){return e instanceof D&&1&e.s}function S(e,t,n){for(var r;;){var o=e();if(A(o)&&(o=o.v),!o)return i;if(o.then){r=0;break}var i=n();if(i&&i.then){if(!A(i)){r=1;break}i=i.s;}var a; }var u=new D,c=C.bind(null,u,2);return (0===r?o.then(s):1===r?i.then(f):a.then(l)).then(void 0,c),u;function f(r){i=r;do{if(!(o=e())||A(o)&&!o.v)return void C(u,1,i);if(o.then)return void o.then(s).then(void 0,c);A(i=n())&&(i=i.v);}while(!i||!i.then);i.then(f).then(void 0,c);}function s(e){e?(i=n())&&i.then?i.then(f).then(void 0,c):f(i):C(u,1,i);}function l(){(o=e())?o.then?o.then(s).then(void 0,c):s(o):C(u,1,i);}}function E(e,t){try{var n=e();}catch(e){return t(true,e)}return n&&n.then?n.then(t.bind(null,false),t.bind(null,true)):t(false,n)}var L=function(n,r){try{var o=W();return Promise.resolve(E(function(){return Promise.resolve(B(function(){var i,u=k$1(S$1,null);return u[a]=[n],o.rootHook&&o.rootHook(n,((i={})[a]=u,i.nodeType=1,i)),q(n,r||T,!1,void 0,u,!0,void 0,o)})).then(function(e){var t,n=function(){if(P(e)){var n=function(){var e=o.join(U);return t=1,e},r=0,o=e,i=S(function(){return !!o.some(function(e){return e&&"function"==typeof e.then})&&r++<25},void 0,function(){return Promise.resolve(Promise.all(o)).then(function(e){o=e.flat();})});return i&&i.then?i.then(n):n()}}();return n&&n.then?n.then(function(n){return t?n:e}):t?n:e})},function(e,t){if(o.commitHook&&B(function(){return o.commitHook(n,j)}),j.length=0,e)throw t;return t}))}catch(e){return Promise.reject(e)}},T={},j=[],P=Array.isArray,$=Object.assign,U="",Z="\x3c!--$s--\x3e",F="\x3c!--/$s--\x3e";function M(e){return "string"==typeof e?Z+e+F:P(e)?(e.unshift(Z),e.push(F),e):e&&"function"==typeof e.then?e.then(M):Z+e+F}function W(){return {beforeDiff:l$1.__b,afterDiff:l$1.diffed,renderHook:l$1.__r,unmountHook:l$1.unmount,rootHook:l$1.__,commitHook:l$1.__c,catchError:l$1.__e,errorBoundaries:l$1.errorBoundaries}}function B(e){var t=l$1[o];l$1[o]=true;try{return e()}finally{l$1[o]=t;}}function N(e,t,n){var r,o=e.type,a=true;return e[i]?(a=false,(r=e[i]).state=r[c]):r=new o(e.props,t),e[i]=r,r.__v=e,r.props=e.props,r.context=t,d(r),null==r.state&&(r.state=T),null==r[c]&&(r[c]=r.state),o.getDerivedStateFromProps?r.state=$({},r.state,o.getDerivedStateFromProps(r.props,r.state)):a&&r.componentWillMount?(r.componentWillMount(),r.state=r[c]!==r.state?r[c]:r.state):!a&&r.componentWillUpdate&&r.componentWillUpdate(),n.renderHook&&n.renderHook(e),r.render(r.props,r.state,t)}function q(e,n,o,u,y,g,k,b){if(null==e||true===e||false===e||e===U)return U;var w=typeof e;if("object"!=w)return "function"==w?U:"string"==w?_(e):e+U;if(P(e)){var C,D=U;y[a]=e;for(var A=e.length,S=0;S<A;S++){var E=e[S];if(null!=E&&"boolean"!=typeof E){var L,j=q(E,n,o,u,y,g,k,b);"string"==typeof j?D+=j:(C||(C=new Array(A)),D&&C.push(D),D=U,P(j)?(L=C).push.apply(L,j):C.push(j));}}return C?(D&&C.push(D),C):D}if(!t(e))return U;e.__=y,b.beforeDiff&&b.beforeDiff(e);var Z=e.type,F=e.props;if("function"==typeof Z){var W,z,O,R=n;if(Z===S$1){if("tpl"in F){for(var K,G=U,J=0;J<F.tpl.length;J++)if(G+=F.tpl[J],F.exprs&&J<F.exprs.length){var Q=F.exprs[J];if(null==Q)continue;if("object"==typeof Q&&(t(Q)||P(Q))){var X,Y=q(Q,n,o,u,e,g,k,b);"string"==typeof Y?G+=Y:(K||(K=[]),G&&K.push(G),G=U,P(Y)?(X=K).push.apply(X,Y):K.push(Y));}else G+=Q;}return K?(G&&K.push(G),K):G}if("UNSTABLE_comment"in F)return "\x3c!--"+_(F.UNSTABLE_comment)+"--\x3e";z=F.children;}else {if(null!=(W=Z.contextType)){var ee=n[W.__c];R=ee?ee.props.value:W.__;}var te=Z.prototype&&"function"==typeof Z.prototype.render;if(te)z=/**#__NOINLINE__**/N(e,R,b),O=e[i];else {e[i]=O=/**#__NOINLINE__**/H(e,R);for(var ne=0;m(O)&&ne++<25;){v(O),b.renderHook&&b.renderHook(e);try{z=Z.call(O,F,R);}catch(t){throw t&&"function"==typeof t.then&&(e._suspended=true),t}}d(O);}if(null!=O.getChildContext&&(n=$({},n,O.getChildContext())),te&&b.errorBoundaries&&(Z.getDerivedStateFromError||O.componentDidCatch)){z=null!=z&&z.type===S$1&&null==z.key&&null==z.props.tpl?z.props.children:z;try{return q(z,n,o,u,e,g,!1,b)}catch(r){return Z.getDerivedStateFromError&&(O[c]=Z.getDerivedStateFromError(r)),O.componentDidCatch&&O.componentDidCatch(r,T),m(O)?(z=N(e,n,b),null!=(O=e[i]).getChildContext&&(n=$({},n,O.getChildContext())),q(z=null!=z&&z.type===S$1&&null==z.key&&null==z.props.tpl?z.props.children:z,n,o,u,e,g,k,b)):U}finally{b.afterDiff&&b.afterDiff(e),b.unmountHook&&b.unmountHook(e);}}}z=null!=z&&z.type===S$1&&null==z.key&&null==z.props.tpl?z.props.children:z;try{var re=q(z,n,o,u,e,g,k,b);return b.afterDiff&&b.afterDiff(e),b.unmountHook&&b.unmountHook(e),e._suspended?M(re):re}catch(t){if(!t||"function"!=typeof t.then)throw t;return t.then(function t(){try{var r=B(function(){return q(z,n,o,u,e,g,k,b)});return e._suspended?M(r):r}catch(e){if(!e||"function"!=typeof e.then)throw e;return e.then(t)}})}}var ie,ae="<"+Z,ue=U;for(var ce in F){var fe=F[ce];if("function"!=typeof(fe=V(fe)?fe.value:fe)||"class"===ce||"className"===ce){switch(ce){case "children":ie=fe;continue;case "key":case "ref":case "__self":case "__source":continue;case "htmlFor":if("for"in F)continue;ce="for";break;case "className":if("class"in F)continue;ce="class";break;case "defaultChecked":ce="checked";break;case "defaultSelected":ce="selected";break;case "defaultValue":case "value":switch(ce="value",Z){case "textarea":ie=fe;continue;case "select":u=fe;continue;case "option":u!=fe||"selected"in F||(ae+=" selected");}break;case "dangerouslySetInnerHTML":ue=fe&&fe.__html;continue;case "style":"object"==typeof fe&&(fe=x(fe));break;case "acceptCharset":ce="accept-charset";break;case "httpEquiv":ce="http-equiv";break;default:if(f.test(ce))continue;s.test(ce)?ce=ce.replace(s,"$1:$2").toLowerCase():"-"!==ce[4]&&!h.has(ce)||null==fe?o?p.test(ce)&&(ce="panose1"===ce?"panose-1":ce.replace(/([A-Z])/g,"-$1").toLowerCase()):l.test(ce)&&(ce=ce.toLowerCase()):fe+=U;}null!=fe&&false!==fe&&(ae=true===fe||fe===U?ae+" "+ce:ae+" "+ce+'="'+_(fe+U)+'"');}}if(f.test(Z))throw new Error(Z+" is not a valid HTML tag name in "+ae+">");if(ue||("string"==typeof ie?ue=_(ie):null!=ie&&false!==ie&&true!==ie&&(ue=q(ie,n,"svg"===Z||"foreignObject"!==Z&&o,u,e,g,k,b))),b.afterDiff&&b.afterDiff(e),b.unmountHook&&b.unmountHook(e),!ue&&I.has(Z))return ae+"/>";var se="</"+Z+">",le=ae+">";return P(ue)?[le].concat(ue,[se]):"string"!=typeof ue?[le,ue,se]:le+ue+se}var I=new Set(["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]);function V(e){return null!==e&&"object"==typeof e&&"function"==typeof e.peek&&"value"in e}

const contexts = /* @__PURE__ */ new WeakMap();
function getContext(result) {
  if (contexts.has(result)) {
    return contexts.get(result);
  }
  let ctx = {
    c: 0,
    get id() {
      return "p" + this.c.toString();
    },
    signals: /* @__PURE__ */ new Map(),
    propsToSignals: /* @__PURE__ */ new Map()
  };
  contexts.set(result, ctx);
  return ctx;
}
function incrementId(ctx) {
  let id = ctx.id;
  ctx.c++;
  return id;
}

function isSignal(x) {
  return x != null && typeof x === "object" && typeof x.peek === "function" && "value" in x;
}
function restoreSignalsOnProps(ctx, props) {
  let propMap;
  if (ctx.propsToSignals.has(props)) {
    propMap = ctx.propsToSignals.get(props);
  } else {
    propMap = /* @__PURE__ */ new Map();
    ctx.propsToSignals.set(props, propMap);
  }
  for (const [key, signal] of propMap) {
    props[key] = signal;
  }
  return propMap;
}
function serializeSignals(ctx, props, attrs, map) {
  const signals = {};
  for (const [key, value] of Object.entries(props)) {
    const isPropArray = Array.isArray(value);
    const isPropObject = !isSignal(value) && typeof props[key] === "object" && props[key] !== null && !isPropArray;
    if (isPropObject || isPropArray) {
      const values = isPropObject ? Object.keys(props[key]) : value;
      values.forEach((valueKey, valueIndex) => {
        const signal = isPropObject ? props[key][valueKey] : valueKey;
        if (isSignal(signal)) {
          const keyOrIndex = isPropObject ? valueKey.toString() : valueIndex;
          props[key] = isPropObject ? Object.assign({}, props[key], { [keyOrIndex]: signal.peek() }) : props[key].map(
            (v, i) => i === valueIndex ? [signal.peek(), i] : v
          );
          const currentMap = map.get(key) || [];
          map.set(key, [...currentMap, [signal, keyOrIndex]]);
          const currentSignals = signals[key] || [];
          signals[key] = [...currentSignals, [getSignalId(ctx, signal), keyOrIndex]];
        }
      });
    } else if (isSignal(value)) {
      props[key] = value.peek();
      map.set(key, value);
      signals[key] = getSignalId(ctx, value);
    }
  }
  if (Object.keys(signals).length) {
    attrs["data-preact-signals"] = JSON.stringify(signals);
  }
}
function getSignalId(ctx, item) {
  let id = ctx.signals.get(item);
  if (!id) {
    id = incrementId(ctx);
    ctx.signals.set(item, id);
  }
  return id;
}

const StaticHtml = ({ value, name, hydrate = true }) => {
  if (!value) return null;
  const tagName = hydrate ? "astro-slot" : "astro-static-slot";
  return k$1(tagName, { name, dangerouslySetInnerHTML: { __html: value } });
};
StaticHtml.shouldComponentUpdate = () => false;
var static_html_default = StaticHtml;

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
let originalConsoleError;
let consoleFilterRefs = 0;
async function check(Component, props, children) {
  if (typeof Component !== "function") return false;
  if (Component.name === "QwikComponent") return false;
  if (Component.prototype != null && typeof Component.prototype.render === "function") {
    return C$1.isPrototypeOf(Component);
  }
  useConsoleFilter();
  try {
    const { html } = await renderToStaticMarkup.call(this, Component, props, children, void 0);
    if (typeof html !== "string") {
      return false;
    }
    return html == "" ? false : !html.includes("<undefined>");
  } catch {
    return false;
  } finally {
    finishUsingConsoleFilter();
  }
}
function shouldHydrate(metadata) {
  return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  const ctx = getContext(this.result);
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = k$1(static_html_default, {
      hydrate: shouldHydrate(metadata),
      value,
      name
    });
  }
  let propsMap = restoreSignalsOnProps(ctx, props);
  const newProps = { ...props, ...slots };
  const attrs = {};
  serializeSignals(ctx, props, attrs, propsMap);
  const vNode = k$1(
    Component,
    newProps,
    children != null ? k$1(static_html_default, {
      hydrate: shouldHydrate(metadata),
      value: children
    }) : children
  );
  const html = await L(vNode);
  return { attrs, html };
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError) return;
  }
  originalConsoleError(msg, ...rest);
}
const renderer = {
  name: "@astrojs/preact",
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true
};
var server_default = renderer;

const renderers = [Object.assign({"name":"@astrojs/preact","clientEntrypoint":"@astrojs/preact/client.js","serverEntrypoint":"@astrojs/preact/server.js"}, { ssr: server_default }),];

export { renderers };
