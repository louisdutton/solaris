var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,s=(t,r,a)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a,i=(e,t)=>{for(var r in t||(t={}))n.call(t,r)&&s(e,r,t[r]);if(a)for(var r of a(t))o.call(t,r)&&s(e,r,t[r]);return e},l=(e,a)=>t(e,r(a));import{A as c,f as m,C as u,V as d,R as f,a as p,O as v,S as h,u as g,r as E,P as x,b as w,B as y,c as S,L as b,q as O,d as P}from"./vendor.e04909d1.js";const M={atmosphere:{uniforms:{},vertexShader:["varying vec3 vNormal;","void main() {","vNormal = normalize( normalMatrix * normal );","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["varying vec3 vNormal;","void main() {","float intensity = pow( 0.9 - dot( vNormal, vec3( 0, 0, 0.9 ) ), 6.0 );","gl_FragColor = vec4( 1.0, 0.8, 0.5, 1.0 ) * intensity;","}"].join("\n")}};const j=(F=0,function(){var e=F+=1831565813;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/4294967296});var F;const R=Math.round(32*j()),C=32+408*j();var q=M.atmosphere;const I=new c,N=I.context,z=new m(N);z.roomSize=.99,z.dampening=3e3,z.wet.value=1,z.dry.value=0,I.setFilter(z),I.setMasterVolume(.01);function A(e){const t=E.exports.useRef(),r=e.index||0,[a,n]=E.exports.useState(),[o,s]=E.exports.useState(!1);E.exports.useEffect((()=>{n(16777215*j());var e=N.createOscillator();e.frequency.value=C+C*r,e.start();var a=new x(I);a.setRolloffFactor(.3),a.setNodeSource(e),t.current.add(a)}),[]),w(((r,a)=>{var n=o?1.1*e.scale:e.scale,s=t.current.scale.x;if(n!=s){var i=.9*s+.1*n;t.current.scale.set(i,i,i)}}));return f.createElement("mesh",l(i({},e),{ref:t,onPointerOver:e=>{s(!0)},onPointerOut:e=>{s(!1)}}),f.createElement("mesh",{scale:1.1},f.createElement("sphereGeometry",{args:[1,32,32]}),f.createElement("shaderMaterial",{vertexShader:q.vertexShader,fragmentShader:q.fragmentShader,side:y,blending:S,transparent:!0})),f.createElement("sphereGeometry",{args:[1,32,32]}),f.createElement("meshStandardMaterial",{color:e.color||a}))}var L=new u(1,48).attributes.position;const V=[];for(let _=1,k=L.count;_<k;_++)V[_]=(new d).fromBufferAttribute(L,_);function B(e){const[t,r]=E.exports.useState(new d(0,Math.PI/2,0)),[a,n]=E.exports.useState();E.exports.useState(!0);const o=e.offset;return w(((r,a)=>{t.x+=e.speed||.015;var s=t,i=new d;i.setFromSphericalCoords(e.scale,s.x+o,o),n(i)})),f.createElement(f.Fragment,null,f.createElement(b,l(i({},e),{points:V,color:"white",lineWidth:1,dashed:!0,dashSize:2,dashScale:20,rotation:t})),f.createElement(A,{index:e.index||0,position:a,scale:.25,frequency:e.frequency}))}function D(){const e=g((({camera:e})=>e));E.exports.useEffect((()=>{e.add(I),I.gain.gain.value=0,I.gain.gain.linearRampToValueAtTime(.01,N.currentTime+5)}));return f.createElement(f.Fragment,null,f.createElement(A,{scale:1,color:"orange"}),(e=>{for(var t=[],r=0;r<e;r++)t.push(f.createElement(B,{scale:1.5+.5*r,speed:.001+.001*r,frequency:440+220*r,offset:2*j()*Math.PI,key:r,index:r}));return f.createElement(f.Fragment,null,t)})(R))}function T(){return f.createElement(p,{style:{width:"100vw",height:"100vh"},dpr:window.devicePixelRatio,camera:{fov:60,aspect:window.innerWidth/window.innerHeight,position:[5,0,0]}},f.createElement(v,{maxDistance:50,minDistance:5,enablePan:!1,enableZoom:!0,enableRotate:!0}),f.createElement("ambientLight",{intensity:.1}),f.createElement("pointLight",{intensity:10,color:"orange"}),f.createElement(h,{fade:!0,factor:10}),f.createElement(D,null))}const G=O.h1`
  font-size: 8em;
  font-weight: light;
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%);
  user-select: none;
  cursor: default;
  opacity: 0;
  animation: fade-in 3s forwards 0.5s;
  text-shadow: 0 0 15px #CCC;
  margin: 0;
`;function W(){return E.exports.useState(0),f.createElement("div",null,f.createElement(T,null),f.createElement(G,null,"SOLARIS"))}P.render(f.createElement(f.StrictMode,null,f.createElement(W,null)),document.getElementById("root"));