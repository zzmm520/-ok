import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import "./LiquidEther.css";

type LiquidEtherProps = {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  resolution?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  className?: string;
  style?: CSSProperties;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
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
`;

function pickColor(colors: string[] | undefined, index: number, fallback: string) {
  return colors?.[index] ?? fallback;
}

export default function LiquidEther({
  colors = ["#ff9ffc", "#42fcff", "#ffe56f"],
  mouseForce = 20,
  cursorSize = 100,
  resolution = 0.5,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  className = "",
  style = {},
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const smoothMouseRef = useRef(new THREE.Vector2(0, 0));
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2() },
      uMouseForce: { value: mouseForce },
      uCursorSize: { value: cursorSize },
      uAutoIntensity: { value: autoIntensity },
      uColorA: { value: new THREE.Color(pickColor(colors, 0, "#ff9ffc")) },
      uColorB: { value: new THREE.Color(pickColor(colors, 1, "#42fcff")) },
      uColorC: { value: new THREE.Color(pickColor(colors, 2, "#ffe56f")) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const width = Math.max(1, Math.floor(mount.clientWidth * resolution));
      const height = Math.max(1, Math.floor(mount.clientHeight * resolution));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      uniforms.uResolution.value.set(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.set(x, y);
      lastMoveRef.current = performance.now();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", resize);
    mount.addEventListener("pointermove", onPointerMove);

    let frameId = 0;
    let isRunning = false;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      const seconds = time / 1000;
      const idle = performance.now() - lastMoveRef.current;
      if (autoDemo && idle > 1200) {
        mouseRef.current.set(
          Math.sin(seconds * autoSpeed) * 0.42,
          Math.cos(seconds * autoSpeed * 0.74) * 0.36,
        );
      }
      smoothMouseRef.current.lerp(mouseRef.current, 0.055);
      uniforms.uTime.value = seconds;
      uniforms.uMouse.value.copy(smoothMouseRef.current);
      uniforms.uMouseForce.value = mouseForce;
      uniforms.uCursorSize.value = cursorSize;
      uniforms.uAutoIntensity.value = autoIntensity;
      uniforms.uColorA.value.set(pickColor(colors, 0, "#ff9ffc"));
      uniforms.uColorB.value.set(pickColor(colors, 1, "#42fcff"));
      uniforms.uColorC.value.set(pickColor(colors, 2, "#ffe56f"));
      renderer.render(scene, camera);
    };
    const start = () => {
      if (isRunning) return;
      isRunning = true;
      frameId = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(frameId);
    };
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "160px" },
    );
    intersectionObserver.observe(mount);

    return () => {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [autoDemo, autoIntensity, autoSpeed, colors, cursorSize, mouseForce, resolution]);

  return (
    <div
      ref={mountRef}
      className={`liquid-ether-container ${className}`}
      style={style}
    />
  );
}
