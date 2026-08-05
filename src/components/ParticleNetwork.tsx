"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const PARTICLE_COUNT = 55;
const LINK_DISTANCE = 130;
const MOUSE_LINK_DISTANCE = 180;

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };
    let animationFrame = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function isDark() {
      return document.documentElement.classList.contains("dark");
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const dotColor = isDark() ? "rgba(16, 185, 129, 0.5)" : "rgba(5, 150, 105, 0.4)";
      const lineColor = isDark() ? "16, 185, 129" : "5, 150, 105";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = dotColor;
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / LINK_DISTANCE)})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }

        const mDist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (mDist < MOUSE_LINK_DISTANCE) {
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.strokeStyle = `rgba(${lineColor}, ${0.3 * (1 - mDist / MOUSE_LINK_DISTANCE)})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }

      animationFrame = requestAnimationFrame(draw);
    }

    function handleMouseMove(e: MouseEvent) {
      mouse = { x: e.clientX, y: e.clientY };
    }

    function handleMouseLeave() {
      mouse = { x: -9999, y: -9999 };
    }

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
