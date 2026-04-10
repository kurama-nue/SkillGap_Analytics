/**
 * EmployeeNode — A single 3D sphere in the skill galaxy.
 * Rendered as an instanced mesh for performance; this component
 * handles selection and hover state for a single node.
 */
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PositionedNode } from '../../hooks/useEmployeeNodes';

const DEPT_COLORS: Record<string, string> = {
  Engineering: '#6378ff',
  'Data Science': '#10d98a',
  Product: '#f59e0b',
  'Human Resources': '#ec4899',
};

interface EmployeeNodeProps {
  node: PositionedNode;
  opacity: number;
  isGapHighlight: boolean;
  onClick: (node: PositionedNode) => void;
}

export function EmployeeNode({ node, opacity, isGapHighlight, onClick }: EmployeeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = isGapHighlight && node.has_skill_gap
    ? '#ef4444'
    : (DEPT_COLORS[node.department ?? ''] ?? '#6378ff');

  const color = new THREE.Color(baseColor);
  const scale = hovered ? 1.4 : 1.0;

  // Bobbing animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = node.y + Math.sin(t * 0.8 + node.x) * 0.08;
    meshRef.current.scale.setScalar(
      scale + Math.sin(t * 2 + node.z) * 0.02
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={[node.x, node.y, node.z]}
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={hovered ? 0.8 : isGapHighlight && node.has_skill_gap ? 0.4 : 0.2}
        roughness={0.3}
        metalness={0.6}
      />

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(8,12,20,0.95)',
              border: `1px solid ${baseColor}40`,
              borderRadius: 8,
              padding: '8px 12px',
              minWidth: 160,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 12px ${baseColor}30`,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
              {node.full_name}
            </p>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: '#94a3b8' }}>
              {node.role} · {node.department}
            </p>
            <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
              <span style={{ color: '#94a3b8' }}>Skills: <b style={{ color: '#f1f5f9' }}>{node.skill_count}</b></span>
              <span style={{ color: '#94a3b8' }}>Avg: <b style={{ color: '#f1f5f9' }}>{node.avg_proficiency.toFixed(1)}</b></span>
            </div>
            {node.has_skill_gap && (
              <div style={{ marginTop: 4, fontSize: 10, color: '#f87171', fontWeight: 500 }}>
                ⚠ Skill gap detected
              </div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
}
