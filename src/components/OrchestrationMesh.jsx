import React from 'react';
import styles from './OrchestrationMesh.module.css';

const CX = 240;
const CY = 150;
const RX = 188;
const RY = 104;
const N = 8;

const nodes = Array.from({length: N}, (_, i) => {
  const a = ((-90 + i * (360 / N)) * Math.PI) / 180; // first node at the top
  return {
    x: +(CX + RX * Math.cos(a)).toFixed(1),
    y: +(CY + RY * Math.sin(a)).toFixed(1),
    r: i % 3 === 0 ? 6.5 : 5,
    gold: i % 2 === 1,
  };
});

const pulseLinks = [0, 3, 6];

export default function OrchestrationMesh() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg viewBox="0 0 480 300" className={styles.svg} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="mesh-glow" x="-40%" y="-40%" width="180%" height="180%" filterUnits="objectBoundingBox">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {}
        <g>
          {nodes.map((n, i) => (
            <line key={`l${i}`} x1={CX} y1={CY} x2={n.x} y2={n.y} className={styles.link} />
          ))}
        </g>

        {}
        <g filter="url(#mesh-glow)">
          {pulseLinks.map((i, k) => (
            <line
              key={`p${i}`}
              x1={CX}
              y1={CY}
              x2={nodes[i].x}
              y2={nodes[i].y}
              className={styles.pulse}
              pathLength="100"
              style={{animationDelay: `${0.4 + k * 1.05}s`}}
            />
          ))}
        </g>

        {}
        <g>
          {nodes.map((n, i) => (
            <circle
              key={`n${i}`}
              cx={n.x}
              cy={n.y}
              r={n.r}
              className={`${styles.node} ${n.gold ? styles.nodeGold : styles.nodeGreen}`}
              style={{animationDelay: `${i * 0.22}s`}}
            />
          ))}
        </g>

        {}
        <g filter="url(#mesh-glow)">
          <circle cx={CX} cy={CY} r="15" className={styles.coreRing} />
          <circle cx={CX} cy={CY} r="8.5" className={styles.core} />
        </g>
      </svg>
    </div>
  );
}
