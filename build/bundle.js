var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function s(){return Object.create(null)}function a(e){e.forEach(n)}function o(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i;function l(e,t){return i||(i=document.createElement("a")),i.href=t,e===i.href}function c(t,n,s){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const s=t.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(n,s))}function u(e,t,n,s){return e[1]&&s?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](s(t))):n.ctx}const p="undefined"!=typeof window;let m=p?()=>window.performance.now():()=>Date.now(),h=p?e=>requestAnimationFrame(e):e;const d=new Set;function f(e){d.forEach((t=>{t.c(e)||(d.delete(t),t.f())})),0!==d.size&&h(f)}function g(e){let t;return 0===d.size&&h(f),{promise:new Promise((n=>{d.add(t={c:e,f:n})})),abort(){d.delete(t)}}}function b(e,t){e.appendChild(t)}function $(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function v(e){const t=k("style");return function(e,t){b(e.head||e,t)}($(e),t),t.sheet}function y(e,t,n){e.insertBefore(t,n||null)}function w(e){e.parentNode.removeChild(e)}function k(e){return document.createElement(e)}function x(){return e=" ",document.createTextNode(e);var e}function S(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function M(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function C(e,t,n,s){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,s?"important":"")}function T(e,t,n){e.classList[n?"add":"remove"](t)}const A=new Map;let I,_=0;function H(e,t,n,s,a,o,r,i=0){const l=16.666/s;let c="{\n";for(let e=0;e<=1;e+=l){const s=t+(n-t)*o(e);c+=100*e+`%{${r(s,1-s)}}\n`}const u=c+`100% {${r(n,1-n)}}\n}`,p=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${i}`,m=$(e),{stylesheet:h,rules:d}=A.get(m)||function(e,t){const n={stylesheet:v(t),rules:{}};return A.set(e,n),n}(m,e);d[p]||(d[p]=!0,h.insertRule(`@keyframes ${p} ${u}`,h.cssRules.length));const f=e.style.animation||"";return e.style.animation=`${f?`${f}, `:""}${p} ${s}ms linear ${a}ms 1 both`,_+=1,p}function P(e,t){const n=(e.style.animation||"").split(", "),s=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),a=n.length-s.length;a&&(e.style.animation=s.join(", "),_-=a,_||h((()=>{_||(A.forEach((e=>{const{stylesheet:t}=e;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.rules={}})),A.clear())})))}function L(e){I=e}const q=[],j=[],E=[],D=[],V=Promise.resolve();let z=!1;function N(e){E.push(e)}const R=new Set;let K,O=0;function B(){const e=I;do{for(;O<q.length;){const e=q[O];O++,L(e),U(e.$$)}for(L(null),q.length=0,O=0;j.length;)j.pop()();for(let e=0;e<E.length;e+=1){const t=E[e];R.has(t)||(R.add(t),t())}E.length=0}while(q.length);for(;D.length;)D.pop()();z=!1,R.clear(),L(e)}function U(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}function F(){return K||(K=Promise.resolve(),K.then((()=>{K=null}))),K}function G(e,t,n){e.dispatchEvent(function(e,t,n=!1){const s=document.createEvent("CustomEvent");return s.initCustomEvent(e,n,!1,t),s}(`${t?"intro":"outro"}${n}`))}const Y=new Set;let W;function Q(e,t){e&&e.i&&(Y.delete(e),e.i(t))}function J(e,t,n,s){if(e&&e.o){if(Y.has(e))return;Y.add(e),W.c.push((()=>{Y.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}const X={duration:0};function Z(n,s,a){let r,i,l=s(n,a),c=!1,u=0;function p(){r&&P(n,r)}function h(){const{delay:s=0,duration:a=300,easing:o=t,tick:h=e,css:d}=l||X;d&&(r=H(n,0,1,a,s,o,d,u++)),h(0,1);const f=m()+s,b=f+a;i&&i.abort(),c=!0,N((()=>G(n,!0,"start"))),i=g((e=>{if(c){if(e>=b)return h(1,0),G(n,!0,"end"),p(),c=!1;if(e>=f){const t=o((e-f)/a);h(t,1-t)}}return c}))}let d=!1;return{start(){d||(d=!0,P(n),o(l)?(l=l(),F().then(h)):h())},invalidate(){d=!1},end(){c&&(p(),c=!1)}}}function ee(n,s,r){let i,l=s(n,r),c=!0;const u=W;function p(){const{delay:s=0,duration:o=300,easing:r=t,tick:p=e,css:h}=l||X;h&&(i=H(n,1,0,o,s,r,h));const d=m()+s,f=d+o;N((()=>G(n,!1,"start"))),g((e=>{if(c){if(e>=f)return p(0,1),G(n,!1,"end"),--u.r||a(u.c),!1;if(e>=d){const t=r((e-d)/o);p(1-t,t)}}return c}))}return u.r+=1,o(l)?F().then((()=>{l=l(),p()})):p(),{end(e){e&&l.tick&&l.tick(1,0),c&&(i&&P(n,i),c=!1)}}}function te(e){e&&e.c()}function ne(e,t,s,r){const{fragment:i,on_mount:l,on_destroy:c,after_update:u}=e.$$;i&&i.m(t,s),r||N((()=>{const t=l.map(n).filter(o);c?c.push(...t):a(t),e.$$.on_mount=[]})),u.forEach(N)}function se(e,t){const n=e.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ae(e,t){-1===e.$$.dirty[0]&&(q.push(e),z||(z=!0,V.then(B)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function oe(t,n,o,r,i,l,c,u=[-1]){const p=I;L(t);const m=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:i,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(p?p.$$.context:[])),callbacks:s(),dirty:u,skip_bound:!1,root:n.target||p.$$.root};c&&c(m.root);let h=!1;if(m.ctx=o?o(t,n.props||{},((e,n,...s)=>{const a=s.length?s[0]:n;return m.ctx&&i(m.ctx[e],m.ctx[e]=a)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](a),h&&ae(t,e)),n})):[],m.update(),h=!0,a(m.before_update),m.fragment=!!r&&r(m.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);m.fragment&&m.fragment.l(e),e.forEach(w)}else m.fragment&&m.fragment.c();n.intro&&Q(t.$$.fragment),ne(t,n.target,n.anchor,n.customElement),B()}L(p)}class re{$destroy(){se(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function ie(t){let n,s,a,o,r;return{c(){n=k("h1"),n.textContent="Venkatesh Sivaraman",s=x(),a=k("p"),a.innerHTML='Hi! 👋🏾 I&#39;m Venkat, a PhD student at the Carnegie Mellon University <a class="link blue dim" href="https://hcii.cmu.edu" target="_blank">Human-Computer Interaction Institute</a>. Advised by\n  <a class="link blue dim" href="https://perer.org" target="_blank">Adam Perer</a>, I study\n  <span class="fw6">how people use artificial intelligence (AI) to guide their decision-making</span>, and use that knowledge to\n  <span class="fw6">build better ways to communicate AI predictions</span>. I&#39;m\n  particularly interested in high-stakes decision making domains such as\n  <span class="fw6">child welfare</span>\n  and <span class="fw6">health care</span>, where an understanding of\n  algorithms&#39; strengths and limitations is crucial to helping improve people&#39;s\n  lives.',o=x(),r=k("p"),r.textContent="I would love to chat about research and collaboration opportunities! Contact\n  me at venkats [at] cmu [dot] edu.",M(n,"class","mt2"),M(a,"class","lh-copy f3 measure-wide"),M(r,"class","lh-copy f4 measure-wide")},m(e,t){y(e,n,t),y(e,s,t),y(e,a,t),y(e,o,t),y(e,r,t)},p:e,i:e,o:e,d(e){e&&w(n),e&&w(s),e&&w(a),e&&w(o),e&&w(r)}}}class le extends re{constructor(e){super(),oe(this,e,null,ie,r,{})}}function ce(t){let n,s,a;return{c(){n=k("h1"),n.innerHTML='Venkatesh Sivaraman <span class="fw2">Experience</span>',s=x(),a=k("div"),a.innerHTML='<h2>Industry</h2> \n\n  <h4 class="mb0">Verily Life Sciences <span class="fw2">Summer 2019</span></h4> \n  <p class="lh-copy mv1">Software Engineering Intern</p> \n  <p class="lh-copy mv1 gray">Worked on the Clinical Studies Platform Data Science team. Designed and\n    implemented an Apache Beam pipeline using both novel and existing NLP\n    algorithms to process the ClinicalTrials.gov database.</p> \n\n  <h4 class="mb0">Apple <span class="fw2">Summer 2017</span></h4> \n  <p class="lh-copy mv1">Software Engineering Intern</p> \n  <p class="lh-copy mv1 gray">Developed software in Swift supporting the CarPlay, HomeKit, and MFi\n    certification programs. One of three projects selected to present to Apple\n    VP of Product Integrity.</p> \n\n  <h2>Education</h2> \n  <h4 class="mb0">Carnegie Mellon University <span class="fw2">2020 - present</span></h4> \n  <p class="lh-copy mv1">Advised by Prof. Adam Perer</p> \n\n  <h4 class="mb0">Massachusetts Institute of Technology <span class="fw2">2016 - 2020</span></h4> \n  <p class="lh-copy mv1">Computer Science and Molecular Biology, Minor in Music</p> \n\n  <h2>Research</h2> \n  <h4 class="mb0">Keating Lab, MIT Biology Department <span class="fw2">2018 - 2020</span></h4> \n  <p class="lh-copy mv1">Advised by Prof. Amy Keating</p> \n  <p class="lh-copy mv1 gray">Built a flexible high-throughput Python pipeline to compute and predict\n    protein binding affinities. Developed a C++ toolkit for designing novel\n    peptides, and an 3D visualization tool to render those peptides around a\n    known protein.</p> \n\n  <h4 class="mb0">Structural Bioinformatics Lab, Pompeu Fabra University <span class="fw2">Summer 2018</span></h4> \n  <p class="lh-copy mv1">Advised by Prof. Baldo Oliva</p> \n  <p class="lh-copy mv1 gray">Created machine learning models to predict mutation-induced changes in\n    protein-protein and DNA-transcription factor interactions.</p> \n\n  <h4 class="mb0">Kloczkowski Lab, Nationwide Children&#39;s Hospital <span class="fw2">2014 - 2016</span></h4> \n  <p class="lh-copy mv1">Advised by Prof. Andrzej Kloczkowski</p> \n  <p class="lh-copy mv1 gray">Developed a novel algorithm to predict protein structure based on statistics\n    of amino acid orientations.</p> \n\n  <h2>Teaching</h2> \n\n  <h4 class="mb0">Interactive Data Science, CMU <span class="fw2">Spring 2022</span></h4> \n  <p class="lh-copy mv1">Taught by Prof. Adam Perer</p> \n  <p class="lh-copy mv1 gray">To lead office hours, prepare lecture and lab materials, give a lecture on\n    Uncertainty Visualization, and grade assignments.</p> \n\n  <h4 class="mb0">Fundamentals of Music Processing, MIT <span class="fw2">Fall 2019</span></h4> \n  <p class="lh-copy mv1">Taught by Eric Humphrey</p> \n  <p class="lh-copy mv1 gray">As the only TA for the class, led office hours, helped prepare lecture, lab,\n    and homework materials, and taught a lecture on the music fingerprinting\n    algorithm (as used in Shazam).</p> \n\n  <h4 class="mb0">Splash, MIT <span class="fw2">2018 and 2019</span></h4> \n  <p class="lh-copy mv1">Co-taught with Brian Mills</p> \n  <p class="lh-copy mv1 gray">Taught one-day classes to 20-40 high schoolers on topics such as film music\n    and music signal processing algorithms.</p> \n\n  <h4 class="mb0">MehtA+ Machine Learning Bootcamp <span class="fw2">Summer 2020 and 2021</span></h4> \n  <p class="lh-copy mv1 gray">Prepared and taught guest lectures on human-centered machine learning,\n    embedding representations, and uncertainty.</p>',M(n,"class","mt2"),M(a,"class","mb4 measure-wide")},m(e,t){y(e,n,t),y(e,s,t),y(e,a,t)},p:e,i:e,o:e,d(e){e&&w(n),e&&w(s),e&&w(a)}}}class ue extends re{constructor(e){super(),oe(this,e,null,ce,r,{})}}function pe(e){let t,n,s;return{c(){t=k("div"),n=k("iframe"),C(n,"position","absolute"),C(n,"top","0"),C(n,"left","0"),C(n,"width","100%"),C(n,"height","100%"),l(n.src,s=e[3])||M(n,"src",s),M(n,"title","YouTube video player"),M(n,"frameborder","0"),M(n,"allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),n.allowFullscreen=!0,M(t,"class","video-container svelte-1i47ena")},m(e,s){y(e,t,s),b(t,n)},p(e,t){8&t&&!l(n.src,s=e[3])&&M(n,"src",s)},d(e){e&&w(t)}}}function me(e){let t,n,s;return{c(){t=k("div"),n=k("img"),l(n.src,s=e[0])||M(n,"src",s),M(n,"class","db w-100 card-img br2 br--top svelte-1i47ena"),M(n,"alt",e[1]),M(t,"class","img-container svelte-1i47ena")},m(e,s){y(e,t,s),b(t,n)},p(e,t){1&t&&!l(n.src,s=e[0])&&M(n,"src",s),2&t&&M(n,"alt",e[1])},d(e){e&&w(t)}}}function he(e){let t,n,s,a,o,r;function i(e,t){return e[0]?me:e[3]?pe:void 0}let l=i(e),c=l&&l(e);const p=e[5].default,m=function(e,t,n,s){if(e){const a=u(e,t,n,s);return e[0](a)}}(p,e,e[4],null);return{c(){t=k("div"),n=k("a"),s=k("div"),c&&c.c(),a=x(),o=k("div"),m&&m.c(),M(o,"class","pa2 card-content svelte-1i47ena"),M(s,"class","card pa3 bg-animate hover-bg-near-white pointer svelte-1i47ena"),M(n,"href",e[2]),M(n,"target","_blank"),M(n,"class","link black"),M(t,"class","fl w-50-ns w-100-m w-100 pa3")},m(e,i){y(e,t,i),b(t,n),b(n,s),c&&c.m(s,null),b(s,a),b(s,o),m&&m.m(o,null),r=!0},p(e,[t]){l===(l=i(e))&&c?c.p(e,t):(c&&c.d(1),c=l&&l(e),c&&(c.c(),c.m(s,a))),m&&m.p&&(!r||16&t)&&function(e,t,n,s,a,o){if(a){const r=u(t,n,s,o);e.p(r,a)}}(m,p,e,e[4],r?function(e,t,n,s){if(e[2]&&s){const a=e[2](s(n));if(void 0===t.dirty)return a;if("object"==typeof a){const e=[],n=Math.max(t.dirty.length,a.length);for(let s=0;s<n;s+=1)e[s]=t.dirty[s]|a[s];return e}return t.dirty|a}return t.dirty}(p,e[4],t,null):function(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let e=0;e<n;e++)t[e]=-1;return t}return-1}(e[4]),null),(!r||4&t)&&M(n,"href",e[2])},i(e){r||(Q(m,e),r=!0)},o(e){J(m,e),r=!1},d(e){e&&w(t),c&&c.d(),m&&m.d(e)}}}function de(e,t,n){let{$$slots:s={},$$scope:a}=t,{imageSrc:o=null}=t,{imageAlt:r=""}=t,{url:i=""}=t,{videoSrc:l=null}=t;return e.$$set=e=>{"imageSrc"in e&&n(0,o=e.imageSrc),"imageAlt"in e&&n(1,r=e.imageAlt),"url"in e&&n(2,i=e.url),"videoSrc"in e&&n(3,l=e.videoSrc),"$$scope"in e&&n(4,a=e.$$scope)},[o,r,i,l,a,s]}class fe extends re{constructor(e){super(),oe(this,e,de,he,r,{imageSrc:0,imageAlt:1,url:2,videoSrc:3})}}function ge(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Emblaze: <span class="fw3 ml1">Interactive Embedding Comparison Widget</span>',n=x(),s=k("p"),s.textContent="Emblaze is a Jupyter notebook widget that enables creators of machine\n      learning (ML) models to analyze and compare embedding spaces.",a=x(),o=k("p"),o.innerHTML='<a class="f6 link dim ph3 pv2 dib white bg-blue" href="https://bit.ly/emblaze-demo" target="_blank">Demo</a> \n      <a class="f6 link dim ph3 pv2 dib white bg-black" href="https://github.com/cmudig/emblaze" target="_blank">GitHub</a>',M(t,"class","mb0 lh-title"),M(s,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function be(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='TextEssence: <span class="fw3 ml1">Comparison of COVID Clinical Concepts</span>',n=x(),s=k("p"),s.textContent="This demo (presented at NAACL 2021) allows you to study and compare\n      embeddings of clinical concepts related to COVID-19. The demo currently\n      supports Firefox and Chrome. Developed with Denis Newman-Griffis.",a=x(),o=k("p"),o.innerHTML='<a class="f6 link dim ph3 pv2 dib white bg-blue" href="https://textessence.dbmi.pitt.edu" target="_blank">Demo</a> \n      <a class="f6 link dim ph3 pv2 dib white bg-black" href="https://github.com/drgriffis/textessence" target="_blank">GitHub</a>',M(t,"class","mb0 lh-title"),M(s,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function $e(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='FireRoad: <span class="fw3 ml1">MIT Course Planner</span>',n=x(),s=k("p"),s.textContent="FireRoad is a web, iOS, and Android application that helps MIT students\n      plan what courses they want to fulfill their undergraduate requirements.\n      It offers an easy-to-use API on which students can build new applications.",a=x(),o=k("p"),o.innerHTML='<a class="f6 link dim ph3 pv2 dib white bg-blue" href="https://fireroad.mit.edu" target="_blank">Website</a> \n      <a class="f6 link dim ph3 pv2 dib white bg-black" href="https://github.com/venkatesh-sivaraman/fireroad-server" target="_blank">GitHub</a>',M(t,"class","mb0 lh-title"),M(s,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function ve(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='ShapeSynth: <span class="fw3 ml1">Multimodal Music Generation</span>',n=x(),s=k("p"),s.textContent="This course project from MIT's Interactive Music Systems class (taught by\n      Eran Egozy) allows users to create and visualize synthesized music using\n      the keyboard, a MIDI instrument, or a Kinect. Created with Matthew\n      Huggins.",a=x(),o=k("p"),o.innerHTML='<a class="f6 link dim ph3 pv2 dib white bg-black" href="https://github.com/mdhuggins/shapesynth" target="_blank">GitHub</a>',M(t,"class","mb0 lh-title"),M(s,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function ye(e){let t,n,s,a,o,r,i,l,c,u,p,m,h;return r=new fe({props:{imageSrc:"assets/emblaze.png",imageAlt:"Two screenshots of the Emblaze user interface.",url:"https://github.com/cmudig/emblaze",$$slots:{default:[ge]},$$scope:{ctx:e}}}),l=new fe({props:{imageSrc:"assets/textessence.png",imageAlt:"Screenshot of TextEssence that shows a scatter plot of COVID concepts",url:"https://textessence.dbmi.pitt.edu",$$slots:{default:[be]},$$scope:{ctx:e}}}),u=new fe({props:{imageSrc:"assets/fireroad.png",imageAlt:"Two smartphones showing screenshots of FireRoad",url:"https://fireroad.mit.edu",$$slots:{default:[$e]},$$scope:{ctx:e}}}),m=new fe({props:{imageSrc:"assets/shapesynth.png",imageAlt:"Two screenshots of ShapeSynth showing colored shapes in each corner",url:"https://github.com/mdhuggins/shapesynth",$$slots:{default:[ve]},$$scope:{ctx:e}}}),{c(){t=k("h1"),t.innerHTML='Venkatesh Sivaraman <span class="fw2">Projects</span>',n=x(),s=k("p"),s.textContent="Here's a sampling of some of the projects and demos I've created in the past.\n  Contact me if you'd like to chat about some of the work I'm doing right now!",a=x(),o=k("div"),te(r.$$.fragment),i=x(),te(l.$$.fragment),c=x(),te(u.$$.fragment),p=x(),te(m.$$.fragment),M(t,"class","mt2"),M(s,"class","lh-copy measure f5"),M(o,"class","cf shift-left equal-height svelte-cc53z3")},m(e,d){y(e,t,d),y(e,n,d),y(e,s,d),y(e,a,d),y(e,o,d),ne(r,o,null),b(o,i),ne(l,o,null),b(o,c),ne(u,o,null),b(o,p),ne(m,o,null),h=!0},p(e,[t]){const n={};1&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n);const s={};1&t&&(s.$$scope={dirty:t,ctx:e}),l.$set(s);const a={};1&t&&(a.$$scope={dirty:t,ctx:e}),u.$set(a);const o={};1&t&&(o.$$scope={dirty:t,ctx:e}),m.$set(o)},i(e){h||(Q(r.$$.fragment,e),Q(l.$$.fragment,e),Q(u.$$.fragment,e),Q(m.$$.fragment,e),h=!0)},o(e){J(r.$$.fragment,e),J(l.$$.fragment,e),J(u.$$.fragment,e),J(m.$$.fragment,e),h=!1},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o),se(r),se(l),se(u),se(m)}}}class we extends re{constructor(e){super(),oe(this,e,null,ye,r,{})}}function ke(t){let n,s,a;return{c(){n=k("h1"),n.innerHTML='Venkatesh Sivaraman <span class="fw2">Publications</span>',s=x(),a=k("section"),a.innerHTML='<h2>2022</h2> \n  <p><strong>Sivaraman, V.</strong>, Wu, Y., &amp; Perer, A. (2022). Emblaze:\n    Illuminating machine learning representations through interactive comparison\n    of embedding spaces. <em>To appear at ACM IUI 2022.</em> \n    <a class="link blue" href="https://bit.ly/emblaze-demo" target="_blank">[Demo]</a> \n    <a class="link blue" href="https://github.com/cmudig/emblaze" target="_blank">[GitHub]</a></p> \n  <h2>2021</h2> \n  <p>Wu, J., <strong>Sivaraman, V.</strong>, Kumar, D. (first three authors equal\n    contribution), Banda, J. M., &amp; Sontag, D. (2021). Pulse of the pandemic:\n    Iterative topic filtering for clinical information extraction from social\n    media. <em>Journal of Biomedical Informatics.</em> \n    <a class="link blue" href="https://www.sciencedirect.com/science/article/abs/pii/S1532046421001738" target="_blank">[Article]</a> \n    <a class="link blue" href="https://arxiv.org/abs/2102.06836" target="_blank">[Preprint]</a></p> \n  <p>Newman-Griffis, D., <strong>Sivaraman, V.</strong>, Perer, A.,\n    Fosler-Lussier, E., &amp; Hochheiser, H. (2021). TextEssence: A Tool for\n    Interactive Analysis of Semantic Shifts Between Corpora.\n    <em>NAACL Systems Demonstration.</em> \n    <a class="link blue" href="https://textessence.dbmi.pitt.edu" target="_blank">[Demo]</a> \n    <a class="link blue" href="https://aclanthology.org/2021.naacl-demos.13/" target="_blank">[Article]</a> \n    <a class="link blue" href="https://arxiv.org/abs/2103.11029" target="_blank">[Preprint]</a></p> \n  <p>Hwang, T., Parker, S. S., Hill, S. M., Ilunga, M. W., Grant, R. A.,\n    <strong>Sivaraman, V.</strong>, Mouneimne, G., &amp; Keating, A. E. (2021). A\n    proteome-wide screen uncovers diverse roles for sequence context surrounding\n    proline-rich motifs in Ena/VASP molecular recognition.\n    <em>Under review.</em> \n    <a class="link blue" href="https://www.biorxiv.org/content/10.1101/2021.03.22.436451v1" target="_blank">[Preprint]</a></p> \n  <h2>Older</h2> \n  <p><strong>Sivaraman, V.</strong>, Yoon, D., &amp; Mitros, P. (2016). Simplified\n    audio production in asynchronous voice-based discussions.\n    <em>ACM CHI 2016.</em> \n    <a class="link blue" href="https://dl.acm.org/doi/10.1145/2858036.2858416" target="_blank">[Article]</a></p>',M(n,"class","mt2"),M(a,"class","lh-copy measure-wide")},m(e,t){y(e,n,t),y(e,s,t),y(e,a,t)},p:e,i:e,o:e,d(e){e&&w(n),e&&w(s),e&&w(a)}}}class xe extends re{constructor(e){super(),oe(this,e,null,ke,r,{})}}function Se(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Solo Recital <span class="fw3 ml1">Fall 2020</span>',n=x(),s=k("p"),s.textContent="November 2020",a=x(),o=k("p"),o.textContent="Venkat performs sonatas by Scriabin, Beethoven, and Rachmaninoff in this\n      virtual solo recital streamed from Carnegie Mellon's Kresge Recital Hall.",M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Me(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Ravel: <span class="fw3 ml1">Piano Concerto in G</span>',n=x(),s=k("p"),s.textContent="October 2021",a=x(),o=k("p"),o.textContent="Venkat performs Ravel's Piano Concerto as a soloist with the MIT Symphony\n      as co-winner of the MIT Concerto Competition from 2020. Click to watch the\n      live-stream (performance starts at 20').",M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Ce(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Dvorak: <span class="fw3 ml1">Piano Trio No. 3</span>',n=x(),s=k("p"),s.textContent="December 2019",a=x(),o=k("p"),o.textContent="Ji Seok Kim, Taylor Safrit, and Venkatesh Sivaraman perform Dvorak's Piano\n      Trio No. 3 at MIT's Killian Hall in a Chamber Music Society concert.",M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Te(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Shulamit Ran: <span class="fw3 ml1">Soliloquy</span>',n=x(),s=k("p"),s.textContent="May 2019",a=x(),o=k("p"),o.textContent="Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Soliloquy by\n      Shulamit Ran at an MIT Chamber Music Society concert.",M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Ae(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Sivaraman: <span class="fw3 ml1">Picasso&#39;s Dreams</span>',n=x(),s=k("p"),s.textContent="April 2019",a=x(),o=k("p"),o.textContent="Venkat performs his composition Picasso's Dreams at a solo recital at\n      MIT's Killian Hall.",M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Ie(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Shostakovich: <span class="fw3 ml1">Piano Trio No. 2</span>',n=x(),s=k("p"),s.textContent="May 2018",a=x(),o=k("p"),o.innerHTML='Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Shostakovich&#39;s\n      second piano trio at an MIT Chamber Music Society concert in Killian Hall.\n      See also the\n      <a class="link blue" href="https://www.youtube.com/watch?v=RUwITozfR74" target="_blank">second</a>\n      and\n      <a class="link blue" href="https://www.youtube.com/watch?v=0dqsxVFovXo" target="_blank">third/fourth</a> movements.',M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function _e(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Ravel: <span class="fw3 ml1">Gaspard de la Nuit</span>',n=x(),s=k("p"),s.textContent="March 2018",a=x(),o=k("p"),o.innerHTML='Venkat performs the legendarily difficult <em>Gaspard de la Nuit</em>\n      suite by Ravel at a solo recital in MIT&#39;s Killian Hall. See also the\n      <a class="link blue" href="https://www.youtube.com/watch?v=-iSp0s9zpUE" target="_blank">second</a>\n      and\n      <a class="link blue" href="https://www.youtube.com/watch?v=cULwYsX6Q88" target="_blank">third</a> movements.',M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function He(e){let t,n,s,a,o;return{c(){t=k("h3"),t.innerHTML='Ravel: <span class="fw3 ml1">Piano Trio in A minor</span>',n=x(),s=k("p"),s.textContent="December 2017",a=x(),o=k("p"),o.innerHTML='Venkat performs Ravel&#39;s Piano Trio with Henry Love and Taylor Safrit. See\n      also the\n      <a class="link blue" href="https://www.youtube.com/watch?v=7Ku-EH3iPQc" target="_blank">first</a>,\n      <a class="link blue" href="https://www.youtube.com/watch?v=KfOMI2H7vMk" target="_blank">third</a>, and\n      <a class="link blue" href="https://www.youtube.com/watch?v=FllN04uTW4k" target="_blank">fourth</a> movements.',M(t,"class","mb0 lh-title"),M(s,"class","gray mv0"),M(o,"class","lh-copy")},m(e,r){y(e,t,r),y(e,n,r),y(e,s,r),y(e,a,r),y(e,o,r)},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o)}}}function Pe(e){let t,n,s,a,o,r,i,l,c,u,p,m,h,d,f,g,$,v,S,C,T;return r=new fe({props:{url:"https://www.youtube.com/watch?v=AjKWi564EIY",videoSrc:"https://www.youtube.com/embed/AjKWi564EIY",$$slots:{default:[Se]},$$scope:{ctx:e}}}),l=new fe({props:{url:"https://mta.mit.edu/video/mitso-fall-concert-live-webcast",imageSrc:"assets/mitso.png",imageAlt:"A picture of Venkat at the piano from a poster for his performance with the MIT Symphony",$$slots:{default:[Me]},$$scope:{ctx:e}}}),u=new fe({props:{url:"https://www.youtube.com/watch?v=Yo6NBDNKYiM",videoSrc:"https://www.youtube.com/embed/Yo6NBDNKYiM",$$slots:{default:[Ce]},$$scope:{ctx:e}}}),m=new fe({props:{url:"https://www.youtube.com/watch?v=Ulj9CzxSgwU",videoSrc:"https://www.youtube.com/embed/Ulj9CzxSgwU",$$slots:{default:[Te]},$$scope:{ctx:e}}}),d=new fe({props:{url:"https://www.youtube.com/watch?v=sldyqayzrKw",videoSrc:"https://www.youtube.com/embed/sldyqayzrKw",$$slots:{default:[Ae]},$$scope:{ctx:e}}}),g=new fe({props:{url:"https://www.youtube.com/watch?v=PyQaq62N_fI",videoSrc:"https://www.youtube.com/embed/PyQaq62N_fI",$$slots:{default:[Ie]},$$scope:{ctx:e}}}),v=new fe({props:{url:"https://www.youtube.com/watch?v=PyQaq62N_fI",videoSrc:"https://www.youtube.com/embed/PyQaq62N_fI",$$slots:{default:[_e]},$$scope:{ctx:e}}}),C=new fe({props:{url:"https://www.youtube.com/watch?v=sb6SReBcXUI",videoSrc:"https://www.youtube.com/embed/sb6SReBcXUI",$$slots:{default:[He]},$$scope:{ctx:e}}}),{c(){t=k("h1"),t.innerHTML='Venkatesh Sivaraman <span class="fw2">Music</span>',n=x(),s=k("p"),s.textContent="I have been studying piano since the age of three, and have performed solo,\n  chamber, and orchestral works with a variety of groups. See some of my recent\n  performances below!",a=x(),o=k("div"),te(r.$$.fragment),i=x(),te(l.$$.fragment),c=x(),te(u.$$.fragment),p=x(),te(m.$$.fragment),h=x(),te(d.$$.fragment),f=x(),te(g.$$.fragment),$=x(),te(v.$$.fragment),S=x(),te(C.$$.fragment),M(t,"class","mt2"),M(s,"class","lh-copy measure f5"),M(o,"class","cf shift-left equal-height svelte-cc53z3")},m(e,w){y(e,t,w),y(e,n,w),y(e,s,w),y(e,a,w),y(e,o,w),ne(r,o,null),b(o,i),ne(l,o,null),b(o,c),ne(u,o,null),b(o,p),ne(m,o,null),b(o,h),ne(d,o,null),b(o,f),ne(g,o,null),b(o,$),ne(v,o,null),b(o,S),ne(C,o,null),T=!0},p(e,[t]){const n={};1&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n);const s={};1&t&&(s.$$scope={dirty:t,ctx:e}),l.$set(s);const a={};1&t&&(a.$$scope={dirty:t,ctx:e}),u.$set(a);const o={};1&t&&(o.$$scope={dirty:t,ctx:e}),m.$set(o);const i={};1&t&&(i.$$scope={dirty:t,ctx:e}),d.$set(i);const c={};1&t&&(c.$$scope={dirty:t,ctx:e}),g.$set(c);const p={};1&t&&(p.$$scope={dirty:t,ctx:e}),v.$set(p);const h={};1&t&&(h.$$scope={dirty:t,ctx:e}),C.$set(h)},i(e){T||(Q(r.$$.fragment,e),Q(l.$$.fragment,e),Q(u.$$.fragment,e),Q(m.$$.fragment,e),Q(d.$$.fragment,e),Q(g.$$.fragment,e),Q(v.$$.fragment,e),Q(C.$$.fragment,e),T=!0)},o(e){J(r.$$.fragment,e),J(l.$$.fragment,e),J(u.$$.fragment,e),J(m.$$.fragment,e),J(d.$$.fragment,e),J(g.$$.fragment,e),J(v.$$.fragment,e),J(C.$$.fragment,e),T=!1},d(e){e&&w(t),e&&w(n),e&&w(s),e&&w(a),e&&w(o),se(r),se(l),se(u),se(m),se(d),se(g),se(v),se(C)}}}class Le extends re{constructor(e){super(),oe(this,e,null,Pe,r,{})}}const qe=[];function je(t){const{subscribe:n,set:s,update:a}=function(t,n=e){let s;const a=new Set;function o(e){if(r(t,e)&&(t=e,s)){const e=!qe.length;for(const e of a)e[1](),qe.push(e,t);if(e){for(let e=0;e<qe.length;e+=2)qe[e][0](qe[e+1]);qe.length=0}}}return{set:o,update:function(e){o(e(t))},subscribe:function(r,i=e){const l=[r,i];return a.add(l),1===a.size&&(s=n(o)||e),r(t),()=>{a.delete(l),0===a.size&&(s(),s=null)}}}}(t);let o=t;n((e=>o=e));let i=null;function l(e){i!==e&&(i=e,s(null))}return{subscribe:n,onOutro:function(){s(i)},set(e){e!=o&&l(e)},update(e){l(e(o))}}}function Ee(e){let t,n,s,a,o,r,i,l,c;return n=new Le({}),{c(){t=k("div"),te(n.$$.fragment),s=x(),a=k("footer"),a.textContent="Copyright 2022 Venkatesh Sivaraman.",M(a,"class","gray svelte-jqhf2d"),M(t,"class","document svelte-jqhf2d")},m(o,r){y(o,t,r),ne(n,t,null),b(t,s),b(t,a),i=!0,l||(c=S(t,"outroend",e[3].onOutro),l=!0)},p(t,n){e=t},i(s){i||(Q(n.$$.fragment,s),N((()=>{r&&r.end(1),o=Z(t,e[4],{above:4<e[2]}),o.start()})),i=!0)},o(s){J(n.$$.fragment,s),o&&o.invalidate(),r=ee(t,e[4],{above:e[0]>4}),i=!1},d(e){e&&w(t),se(n),e&&r&&r.end(),l=!1,c()}}}function De(e){let t,n,s,a,o,r,i,l,c;return n=new ue({}),{c(){t=k("div"),te(n.$$.fragment),s=x(),a=k("footer"),a.textContent="Copyright 2022 Venkatesh Sivaraman.",M(a,"class","gray svelte-jqhf2d"),M(t,"class","document svelte-jqhf2d")},m(o,r){y(o,t,r),ne(n,t,null),b(t,s),b(t,a),i=!0,l||(c=S(t,"outroend",e[3].onOutro),l=!0)},p(t,n){e=t},i(s){i||(Q(n.$$.fragment,s),N((()=>{r&&r.end(1),o=Z(t,e[4],{above:3<e[2]}),o.start()})),i=!0)},o(s){J(n.$$.fragment,s),o&&o.invalidate(),r=ee(t,e[4],{above:e[0]>3}),i=!1},d(e){e&&w(t),se(n),e&&r&&r.end(),l=!1,c()}}}function Ve(e){let t,n,s,a,o,r,i,l,c;return n=new xe({}),{c(){t=k("div"),te(n.$$.fragment),s=x(),a=k("footer"),a.textContent="Copyright 2022 Venkatesh Sivaraman.",M(a,"class","gray svelte-jqhf2d"),M(t,"class","document svelte-jqhf2d")},m(o,r){y(o,t,r),ne(n,t,null),b(t,s),b(t,a),i=!0,l||(c=S(t,"outroend",e[3].onOutro),l=!0)},p(t,n){e=t},i(s){i||(Q(n.$$.fragment,s),N((()=>{r&&r.end(1),o=Z(t,e[4],{above:2<e[2]}),o.start()})),i=!0)},o(s){J(n.$$.fragment,s),o&&o.invalidate(),r=ee(t,e[4],{above:e[0]>2}),i=!1},d(e){e&&w(t),se(n),e&&r&&r.end(),l=!1,c()}}}function ze(e){let t,n,s,a,o,r,i,l,c;return n=new we({}),{c(){t=k("div"),te(n.$$.fragment),s=x(),a=k("footer"),a.textContent="Copyright 2022 Venkatesh Sivaraman.",M(a,"class","gray svelte-jqhf2d"),M(t,"class","document svelte-jqhf2d")},m(o,r){y(o,t,r),ne(n,t,null),b(t,s),b(t,a),i=!0,l||(c=S(t,"outroend",e[3].onOutro),l=!0)},p(t,n){e=t},i(s){i||(Q(n.$$.fragment,s),N((()=>{r&&r.end(1),o=Z(t,e[4],{above:1<e[2]}),o.start()})),i=!0)},o(s){J(n.$$.fragment,s),o&&o.invalidate(),r=ee(t,e[4],{above:e[0]>1}),i=!1},d(e){e&&w(t),se(n),e&&r&&r.end(),l=!1,c()}}}function Ne(e){let t,n,s,a,o,r,i,l,c;return n=new le({}),{c(){t=k("div"),te(n.$$.fragment),s=x(),a=k("footer"),a.textContent="Copyright 2022 Venkatesh Sivaraman.",M(a,"class","gray svelte-jqhf2d"),M(t,"class","document svelte-jqhf2d")},m(o,r){y(o,t,r),ne(n,t,null),b(t,s),b(t,a),i=!0,l||(c=S(t,"outroend",e[3].onOutro),l=!0)},p(t,n){e=t},i(s){i||(Q(n.$$.fragment,s),N((()=>{r&&r.end(1),o=Z(t,e[4],{above:0<e[2]}),o.start()})),i=!0)},o(s){J(n.$$.fragment,s),o&&o.invalidate(),r=ee(t,e[4],{above:e[0]>0}),i=!1},d(e){e&&w(t),se(n),e&&r&&r.end(),l=!1,c()}}}function Re(e){let t,n,s,o,r,i,c,u,p,m,h,d,f,g,$,v,C,A,I,_,H,P,L,q,j,E,D,V,z;const N=[Ne,ze,Ve,De,Ee],R=[];function K(e,t){return 0==e[1]?0:1==e[1]?1:2==e[1]?2:3==e[1]?3:4==e[1]?4:-1}return~(j=K(e))&&(E=R[j]=N[j](e)),{c(){t=k("main"),n=k("aside"),s=k("div"),o=k("img"),i=x(),c=k("ul"),u=k("li"),p=k("a"),p.textContent="About",m=x(),h=k("li"),d=k("a"),d.textContent="Projects",f=x(),g=k("li"),$=k("a"),$.textContent="Publications",v=x(),C=k("li"),A=k("a"),A.textContent="Experience",I=x(),_=k("li"),H=k("a"),H.textContent="Music",P=x(),L=k("li"),L.innerHTML='<a class="link github-link flex items-center svelte-jqhf2d" href="https://github.com/venkatesh-sivaraman" target="_blank"><img class="mr2" src="assets/github.png" width="20" height="20"/>\n            GitHub</a>',q=x(),E&&E.c(),M(o,"class","profile-pic dim pointer svelte-jqhf2d"),l(o.src,r="assets/profile.png")||M(o,"src","assets/profile.png"),M(o,"alt","Picture of Venkat in Cambridge, Massachusetts"),M(p,"class","svelte-jqhf2d"),T(p,"active-link",0==e[1]),T(p,"link",0!=e[1]),M(u,"class","svelte-jqhf2d"),M(d,"class","svelte-jqhf2d"),T(d,"active-link",1==e[1]),T(d,"link",1!=e[1]),M(h,"class","svelte-jqhf2d"),M($,"class","svelte-jqhf2d"),T($,"active-link",2==e[1]),T($,"link",2!=e[1]),M(g,"class","svelte-jqhf2d"),M(A,"class","svelte-jqhf2d"),T(A,"active-link",3==e[1]),T(A,"link",3!=e[1]),M(C,"class","svelte-jqhf2d"),M(H,"class","svelte-jqhf2d"),T(H,"active-link",4==e[1]),T(H,"link",4!=e[1]),M(_,"class","svelte-jqhf2d"),M(L,"class","svelte-jqhf2d"),M(c,"class","list nav-list pl0 svelte-jqhf2d"),M(s,"class","nav-container svelte-jqhf2d"),M(n,"class","svelte-jqhf2d"),M(t,"class","sans-serif svelte-jqhf2d")},m(a,r){y(a,t,r),b(t,n),b(n,s),b(s,o),b(s,i),b(s,c),b(c,u),b(u,p),b(c,m),b(c,h),b(h,d),b(c,f),b(c,g),b(g,$),b(c,v),b(c,C),b(C,A),b(c,I),b(c,_),b(_,H),b(c,P),b(c,L),b(t,q),~j&&R[j].m(t,null),D=!0,V||(z=[S(o,"click",e[6]),S(p,"click",e[7]),S(d,"click",e[8]),S($,"click",e[9]),S(A,"click",e[10]),S(H,"click",e[11])],V=!0)},p(e,[n]){2&n&&T(p,"active-link",0==e[1]),2&n&&T(p,"link",0!=e[1]),2&n&&T(d,"active-link",1==e[1]),2&n&&T(d,"link",1!=e[1]),2&n&&T($,"active-link",2==e[1]),2&n&&T($,"link",2!=e[1]),2&n&&T(A,"active-link",3==e[1]),2&n&&T(A,"link",3!=e[1]),2&n&&T(H,"active-link",4==e[1]),2&n&&T(H,"link",4!=e[1]);let s=j;j=K(e),j===s?~j&&R[j].p(e,n):(E&&(W={r:0,c:[],p:W},J(R[s],1,1,(()=>{R[s]=null})),W.r||a(W.c),W=W.p),~j?(E=R[j],E?E.p(e,n):(E=R[j]=N[j](e),E.c()),Q(E,1),E.m(t,null)):E=null)},i(e){D||(Q(E),D=!0)},o(e){J(E),D=!1},d(e){e&&w(t),~j&&R[j].d(),V=!1,a(z)}}}function Ke(e,t,n){let s,{name:a}=t;const o=je(0);c(e,o,(e=>n(1,s=e)));let r=0,i=0;return e.$$set=e=>{"name"in e&&n(5,a=e.name)},e.$$.update=()=>{var t;3&e.$$.dirty&&s!=i&&null!=s&&(console.log(s,i),n(2,r=s),s=i,t=s,o.set(t))},[i,s,r,o,function(e,{duration:t=500,above:n=1,amount:s=100}){return{duration:t,css:e=>{const t=function(e){return e<.5?4*e*e*e:.5*Math.pow(2*e-2,3)+1}(e);return`\n\t\t\t\t\ttransform: translateY(${(s-t*s)*(n?-1:1)}px);\n\t\t\t\t\topacity: ${t};`}}},a,()=>n(0,i=0),()=>n(0,i=0),()=>n(0,i=1),()=>n(0,i=2),()=>n(0,i=3),()=>n(0,i=4)]}return new class extends re{constructor(e){super(),oe(this,e,Ke,Re,r,{name:5})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
