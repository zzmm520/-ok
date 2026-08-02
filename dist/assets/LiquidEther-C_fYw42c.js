import{r as c,j}from"./index-BRHpD7bM.js";import{V as v,W as T,S as U,O as V,C as M,a as G,M as H,P as N}from"./three.module-DAOhRHhG.js";const _=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,k=`
precision highp float;

uniform float uTime;
uniform float uMouseForce;
uniform float uCursorSize;
uniform float uAutoIntensity;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

float blob(vec2 p, vec2 c, float size) {
  return size / max(length(p - c), 0.001);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  float t = uTime;
  vec2 autoPoint = vec2(
    sin(t * 0.38) * 0.45 + cos(t * 0.21) * 0.18,
    cos(t * 0.31) * 0.34 + sin(t * 0.17) * 0.18
  );
  vec2 cursorPoint = mix(autoPoint, uMouse, smoothstep(0.0, 0.08, length(uMouse)));

  float flow =
    blob(p, autoPoint, 0.022 * uAutoIntensity) +
    blob(p, vec2(cos(t * 0.25), sin(t * 0.29)) * 0.58, 0.018 * uAutoIntensity) +
    blob(p, cursorPoint, 0.0025 * uMouseForce * uCursorSize / 100.0);

  float ribbon = sin((p.x * 2.2 + p.y * 1.45 + flow * 0.9 + t * 0.72) * 3.14159);
  float wave = smoothstep(-0.25, 1.0, ribbon) * 0.55 + flow * 0.28;
  vec3 color = mix(uColorA, uColorB, smoothstep(0.05, 1.15, wave));
  color = mix(color, uColorC, smoothstep(0.3, 1.35, sin(flow + t * 0.44) * 0.5 + 0.5));

  float alpha = clamp(wave * 0.24 + flow * 0.18, 0.0, 0.52);
  alpha *= smoothstep(0.02, 0.2, uv.x) * smoothstep(0.02, 0.2, uv.y);
  alpha *= smoothstep(0.02, 0.2, 1.0 - uv.x) * smoothstep(0.02, 0.2, 1.0 - uv.y);

  gl_FragColor = vec4(color, alpha);
}
`;function s(o,u,a){return(o==null?void 0:o[u])??a}function $({colors:o=["#ff9ffc","#42fcff","#ffe56f"],mouseForce:u=20,cursorSize:a=100,resolution:m=.5,autoDemo:x=!0,autoSpeed:h=.5,autoIntensity:d=2.2,className:S="",style:q={}}){const g=c.useRef(null),p=c.useRef(new v(0,0)),b=c.useRef(new v(0,0)),R=c.useRef(0);return c.useEffect(()=>{const e=g.current;if(!e||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let n;try{n=new T({alpha:!0,antialias:!0})}catch{return}n.setClearColor(0,0),n.domElement.setAttribute("aria-hidden","true"),e.appendChild(n.domElement);const y=new U,A=new V(-1,1,1,-1,.1,10);A.position.z=1;const r={uTime:{value:0},uResolution:{value:new v},uMouse:{value:new v},uMouseForce:{value:u},uCursorSize:{value:a},uAutoIntensity:{value:d},uColorA:{value:new M(s(o,0,"#ff9ffc"))},uColorB:{value:new M(s(o,1,"#42fcff"))},uColorC:{value:new M(s(o,2,"#ffe56f"))}},E=new G({vertexShader:_,fragmentShader:k,uniforms:r,transparent:!0,depthWrite:!1}),z=new H(new N(2,2),E);y.add(z);const l=()=>{const i=Math.max(1,Math.floor(e.clientWidth*m)),t=Math.max(1,Math.floor(e.clientHeight*m));n.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),n.setSize(e.clientWidth,e.clientHeight,!1),r.uResolution.value.set(i,t)},P=i=>{const t=e.getBoundingClientRect();if(!t.width||!t.height)return;const C=(i.clientX-t.left)/t.width*2-1,W=-((i.clientY-t.top)/t.height*2-1);p.current.set(C,W),R.current=performance.now()};l();const F=new ResizeObserver(l);F.observe(e),window.addEventListener("resize",l),e.addEventListener("pointermove",P);let w=0,f=!1;const I=i=>{w=requestAnimationFrame(I);const t=i/1e3,C=performance.now()-R.current;x&&C>1200&&p.current.set(Math.sin(t*h)*.42,Math.cos(t*h*.74)*.36),b.current.lerp(p.current,.055),r.uTime.value=t,r.uMouse.value.copy(b.current),r.uMouseForce.value=u,r.uCursorSize.value=a,r.uAutoIntensity.value=d,r.uColorA.value.set(s(o,0,"#ff9ffc")),r.uColorB.value.set(s(o,1,"#42fcff")),r.uColorC.value.set(s(o,2,"#ffe56f")),n.render(y,A)},B=()=>{f||(f=!0,w=requestAnimationFrame(I))},L=()=>{f&&(f=!1,cancelAnimationFrame(w))},O=new IntersectionObserver(([i])=>{i.isIntersecting?B():L()},{rootMargin:"160px"});return O.observe(e),()=>{L(),O.disconnect(),F.disconnect(),window.removeEventListener("resize",l),e.removeEventListener("pointermove",P),n.domElement.parentNode===e&&e.removeChild(n.domElement),z.geometry.dispose(),E.dispose(),n.dispose()}},[x,d,h,o,a,u,m]),j.jsx("div",{ref:g,className:`liquid-ether-container ${S}`,style:q})}export{$ as default};
