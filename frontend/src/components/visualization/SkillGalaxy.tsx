/**
 * SkillGalaxy — React Three Fiber 3D scatter plot scene.
 * Maps employees as glowing spheres in 3D skill space.
 * Filter state drives node opacity and highlight mode.
 */
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { useEmployeeNodes, type PositionedNode } from '../../hooks/useEmployeeNodes';
import { useFilterStore } from '../../store/filterStore';
import { EmployeeNode } from './EmployeeNode';
import { FilterPanel } from './FilterPanel';

// ── Detail panel for selected employee ───────────────────────────────────────
function EmployeeDetail({
  node,
  onClose,
}: {
  node: PositionedNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 280,
        zIndex: 10,
        background: 'rgba(8,12,20,0.95)',
        border: '1px solid rgba(99,120,255,0.25)',
        borderRadius: 14,
        padding: 18,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{node.full_name}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
            {node.role} · {node.seniority}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
        {[
          { label: 'Department', value: node.department ?? '—' },
          { label: 'Skills documented', value: String(node.skill_count) },
          { label: 'Avg proficiency', value: `${node.avg_proficiency.toFixed(2)} / 5.00` },
          { label: 'Email', value: node.email, mono: true },
        ].map(({ label, value, mono }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{label}</span>
            <span style={{ color: 'var(--color-text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mono ? 11 : 13, textAlign: 'right' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Proficiency bar */}
      <div style={{ marginTop: 12 }}>
        <div className="prof-bar-track">
          <div
            className="prof-bar-fill"
            style={{ width: `${(node.avg_proficiency / 5) * 100}%` }}
          />
        </div>
      </div>

      {node.has_skill_gap && (
        <div className="badge-gap" style={{ marginTop: 12 }}>
          ⚠ Skill gap — avg proficiency below 2.5
        </div>
      )}
    </div>
  );
}

// ── Main galaxy scene ─────────────────────────────────────────────────────────
export function SkillGalaxy() {
  const { nodes, departments, isLoading, error } = useEmployeeNodes();
  const { selectedDepartments, showSkillGapsOnly, setHighlightedEmployeeId } = useFilterStore();
  const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(null);

  // Compute per-node opacity based on active filters
  function getOpacity(node: PositionedNode): number {
    const deptFilter =
      selectedDepartments.length === 0 || selectedDepartments.includes(node.department ?? '');
    const gapFilter = !showSkillGapsOnly || node.has_skill_gap;
    return deptFilter && gapFilter ? 1.0 : 0.08;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
        <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Loading skill galaxy…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 28 }}>⚠️</span>
        <p style={{ color: '#f87171', margin: 0 }}>{error}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
          Ensure the backend is running on port 8000.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Sidebar filter */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          width: 200,
        }}
      >
        <FilterPanel departments={departments} />
      </div>

      {/* Stats bar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        {[
          { label: 'Employees', value: nodes.length },
          { label: 'Skill Gaps', value: nodes.filter((n) => n.has_skill_gap).length },
          { label: 'Departments', value: departments.length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="glass-card"
            style={{ padding: '6px 14px', textAlign: 'center', minWidth: 80 }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent-light)' }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 28], fov: 60 }}
        style={{ background: 'transparent' }}
        onPointerMissed={() => setSelectedNode(null)}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#6378ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10d98a" />
        <pointLight position={[0, 0, 15]} intensity={0.6} color="#818cf8" />

        <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade speed={0.5} />

        <Suspense fallback={null}>
          {nodes.map((node) => (
            <EmployeeNode
              key={node.id}
              node={node}
              opacity={getOpacity(node)}
              isGapHighlight={showSkillGapsOnly}
              onClick={(n) => {
                setSelectedNode(n);
                setHighlightedEmployeeId(n.id);
              }}
            />
          ))}
        </Suspense>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={60}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>

      {/* Selected employee detail */}
      {selectedNode && (
        <EmployeeDetail
          node={selectedNode}
          onClose={() => {
            setSelectedNode(null);
            setHighlightedEmployeeId(null);
          }}
        />
      )}

      {/* Interaction hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
        }}
      >
        🖱️ Drag to rotate · Scroll to zoom · Click node for details
      </div>
    </div>
  );
}
