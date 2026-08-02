import{r as a,j as ee}from"./index-BRHpD7bM.js";import{W as te,S as ue,O as oe,C as X,a as ne,A as ae,V as $,M as re,P as se,b as D}from"./three.module-DAOhRHhG.js";const ie=`
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,le=`
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}
`;function ve({color:R="#ff4fd8",colorTwo:h="#42fcff",speed:J=1,ringCount:g=6,attenuation:x=10,lineThickness:C=2,baseRadius:w=.35,radiusStep:M=.1,scaleRate:E=.1,opacity:L=1,blur:c=0,noiseAmount:A=.06,rotation:S=0,ringGap:b=1.5,fadeIn:F=.7,fadeOut:T=.5,followMouse:K=!1,mouseInfluence:O=.2,hoverScale:y=1.2,parallax:B=.05,clickBurst:Q=!1}){const H=a.useRef(null),I=a.useRef(),s=a.useRef([0,0]),r=a.useRef([0,0]),f=a.useRef(0),v=a.useRef(!1),d=a.useRef(0);return I.current={color:R,colorTwo:h,speed:J,ringCount:g,attenuation:x,lineThickness:C,baseRadius:w,radiusStep:M,scaleRate:E,opacity:L,blur:c,noiseAmount:A,rotation:S,ringGap:b,fadeIn:F,fadeOut:T,followMouse:K,mouseInfluence:O,hoverScale:y,parallax:B,clickBurst:Q},a.useEffect(()=>{const u=H.current;if(!u||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let o;try{o=new te({alpha:!0,antialias:!0})}catch{return}o.setClearColor(0,0),o.domElement.setAttribute("aria-hidden","true"),u.appendChild(o.domElement);const P=new ue,k=new oe(-.5,.5,.5,-.5,.1,10);k.position.z=1;const t={uTime:{value:0},uAttenuation:{value:x},uResolution:{value:new $},uColor:{value:new X(R)},uColorTwo:{value:new X(h)},uLineThickness:{value:C},uBaseRadius:{value:w},uRadiusStep:{value:M},uScaleRate:{value:E},uRingCount:{value:g},uOpacity:{value:L},uNoiseAmount:{value:A},uRotation:{value:D.degToRad(S)},uRingGap:{value:b},uFadeIn:{value:F},uFadeOut:{value:T},uMouse:{value:new $},uMouseInfluence:{value:O},uHoverAmount:{value:0},uHoverScale:{value:y},uParallax:{value:B},uBurst:{value:0}},z=new ne({vertexShader:ie,fragmentShader:le,uniforms:t,transparent:!0,depthWrite:!1,blending:ae}),G=new re(new se(1,1),z);P.add(G);const i=()=>{const n=Math.max(1,u.clientWidth),e=Math.max(1,u.clientHeight),p=Math.min(window.devicePixelRatio||1,2);o.setPixelRatio(p),o.setSize(n,e,!1),t.uResolution.value.set(n*p,e*p)},N=n=>{const e=u.getBoundingClientRect();s.current[0]=(n.clientX-e.left)/e.width-.5,s.current[1]=-((n.clientY-e.top)/e.height-.5)},Y=()=>{v.current=!0},j=()=>{v.current=!1,s.current=[0,0]},W=()=>{d.current=1};i();const _=new ResizeObserver(i);_.observe(u),window.addEventListener("resize",i),u.addEventListener("mousemove",N),u.addEventListener("mouseenter",Y),u.addEventListener("mouseleave",j),u.addEventListener("click",W);let m=0,l=!1;const q=n=>{m=requestAnimationFrame(q);const e=I.current;e&&(t.uTime.value=n/1e3*e.speed,t.uAttenuation.value=e.attenuation,t.uColor.value.set(e.color),t.uColorTwo.value.set(e.colorTwo),t.uLineThickness.value=e.lineThickness,t.uBaseRadius.value=e.baseRadius,t.uRadiusStep.value=e.radiusStep,t.uScaleRate.value=e.scaleRate,t.uRingCount.value=Math.min(10,Math.max(1,Math.round(e.ringCount))),t.uOpacity.value=e.opacity,t.uNoiseAmount.value=e.noiseAmount,t.uRotation.value=D.degToRad(e.rotation),t.uRingGap.value=e.ringGap,t.uFadeIn.value=e.fadeIn,t.uFadeOut.value=e.fadeOut,t.uMouseInfluence.value=e.followMouse?e.mouseInfluence:0,t.uHoverScale.value=e.hoverScale,t.uParallax.value=e.parallax,r.current[0]+=(s.current[0]-r.current[0])*.08,r.current[1]+=(s.current[1]-r.current[1])*.08,t.uMouse.value.set(r.current[0],r.current[1]),f.current+=((v.current?1:0)-f.current)*.08,t.uHoverAmount.value=f.current,d.current*=.88,t.uBurst.value=e.clickBurst?d.current:0,o.render(P,k))},Z=()=>{l||(l=!0,m=requestAnimationFrame(q))},V=()=>{l&&(l=!1,cancelAnimationFrame(m))},U=new IntersectionObserver(([n])=>{n.isIntersecting?Z():V()},{rootMargin:"160px"});return U.observe(u),()=>{V(),U.disconnect(),_.disconnect(),window.removeEventListener("resize",i),u.removeEventListener("mousemove",N),u.removeEventListener("mouseenter",Y),u.removeEventListener("mouseleave",j),u.removeEventListener("click",W),o.domElement.parentNode===u&&u.removeChild(o.domElement),G.geometry.dispose(),z.dispose(),o.dispose()}},[]),ee.jsx("div",{ref:H,className:"magic-rings-container",style:c>0?{filter:`blur(${c}px)`}:void 0})}export{ve as default};
