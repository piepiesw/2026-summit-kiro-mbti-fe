"use client";

import { useEffect, useCallback } from "react";

let ghostId = 0;

export default function GhostBurst() {
  const spawn = useCallback((e: MouseEvent) => {
    const count = 6 + Math.floor(Math.random() * 4);
    const container = document.getElementById("ghost-burst-container");
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const delay = i * 60; // stagger spawn

      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const speed = 120 + Math.random() * 160;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const scale = 0.7 + Math.random() * 0.5;
        const wobble = (Math.random() - 0.5) * 120;

        const size = 32;
        const el = document.createElement("img");
        el.src = "/kiro_ghost.svg";
        el.style.cssText = `
          position: fixed;
          left: ${e.clientX - size / 2}px;
          top: ${e.clientY - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          pointer-events: none;
          z-index: 9999;
          opacity: 1;
          transform: scale(${scale}) rotate(${wobble}deg);
          filter: drop-shadow(0 0 8px rgba(124, 92, 252, 0.6));
          transition: none;
        `;
        container.appendChild(el);

        requestAnimationFrame(() => {
          el.style.transition =
            "left 1.8s cubic-bezier(0.2, 0.8, 0.3, 1), " +
            "top 1.8s cubic-bezier(0.2, 0.8, 0.3, 1), " +
            "opacity 1.8s ease-in, " +
            "transform 1.8s ease-out";
          el.style.left = `${e.clientX - size / 2 + dx}px`;
          el.style.top = `${e.clientY - size / 2 + dy}px`;
          el.style.opacity = "0";
          el.style.transform = `scale(${scale * 0.6}) rotate(${wobble + 90}deg)`;
        });

        setTimeout(() => el.remove(), 2000);
      }, delay);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", spawn);
    return () => document.removeEventListener("click", spawn);
  }, [spawn]);

  return (
    <div
      id="ghost-burst-container"
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
