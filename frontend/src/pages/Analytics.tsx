/**
 * Analytics page — Department skill spread cards.
 */
import { useEffect, useState } from 'react';
import { BarChart3, Users, Layers, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { getDepartmentSpread } from '../api/client';
import type { DepartmentSpreadResponse, DepartmentSpread } from '../types';

const DEPT_COLORS: Record<string, string> = {
  Engineering: '#6378ff',
  'Data Science': '#10d98a',
  Product: '#f59e0b',
  'Human Resources': '#ec4899',
};

function DepartmentCard({ dept }: { dept: DepartmentSpread }) {
  const color = DEPT_COLORS[dept.department_name] ?? '#6378ff';
  const profPct = (dept.avg_proficiency / 5) * 100;

  return (
    <div
      className="glass-card"
      style={{
        padding: 24,
        borderTop: `3px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color }}>{dept.department_name}</h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
            {dept.employee_count} employees · {dept.skill_coverage} skills
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color }}>{dept.avg_proficiency.toFixed(1)}</div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>avg proficiency</div>
        </div>
      </div>

      {/* Proficiency bar */}
      <div>
        <div className="prof-bar-track">
          <div className="prof-bar-fill" style={{ width: `${profPct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>
          {profPct.toFixed(0)}% of maximum proficiency
        </p>
      </div>

      {/* Top Skills */}
      {dept.top_skills.length > 0 && (
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Skills
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dept.top_skills.slice(0, 4).map((skill) => (
              <div key={skill.skill_name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 110 }}>
                  {skill.skill_name}
                </span>
                <div className="prof-bar-track" style={{ flex: 1 }}>
                  <div
                    className="prof-bar-fill"
                    style={{
                      width: `${(skill.avg_proficiency / 5) * 100}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color, fontWeight: 600, minWidth: 28, textAlign: 'right' }}>
                  {skill.avg_proficiency.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gaps */}
      {dept.skill_gaps.length > 0 && (
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skill Gaps <span style={{ color: '#f87171' }}>({dept.skill_gaps.length})</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {dept.skill_gaps.map((gap) => (
              <span key={gap} className="badge-gap">{gap}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Analytics() {
  const [data, setData] = useState<DepartmentSpreadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDepartmentSpread();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div
      style={{
        padding: '76px 24px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #6378ff, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BarChart3 size={22} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Department Analytics</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
              Skill spread, proficiency metrics, and gap analysis
            </p>
          </div>
        </div>
        <button className="btn-ghost" onClick={fetchData} style={{ fontSize: 13 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary stats */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { icon: <Users size={18} />, label: 'Total Employees', value: data.total_employees, color: '#6378ff' },
            { icon: <Layers size={18} />, label: 'Unique Skills', value: data.total_skills, color: '#10d98a' },
            { icon: <AlertTriangle size={18} />, label: 'Departments with Gaps', value: data.departments.filter((d) => d.skill_gaps.length > 0).length, color: '#f59e0b' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}20`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color,
                }}
              >
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card skeleton" style={{ height: 300 }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ color: '#f87171', marginBottom: 12 }}>{error}</p>
          <button className="btn-primary" onClick={fetchData}>Retry</button>
        </div>
      )}

      {/* Department cards */}
      {data && (
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16 }}
        >
          {data.departments.map((dept) => (
            <DepartmentCard key={dept.department_name} dept={dept} />
          ))}
        </div>
      )}

      {data && (
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Generated at {new Date(data.generated_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
