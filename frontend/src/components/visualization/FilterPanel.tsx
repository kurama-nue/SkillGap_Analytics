/**
 * FilterPanel — Department toggles and skill gap filter for the 3D galaxy.
 */
import { Filter, RotateCcw, AlertTriangle } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';

const DEPT_COLORS: Record<string, string> = {
  Engineering: '#6378ff',
  'Data Science': '#10d98a',
  Product: '#f59e0b',
  'Human Resources': '#ec4899',
};

interface FilterPanelProps {
  departments: string[];
}

export function FilterPanel({ departments }: FilterPanelProps) {
  const {
    selectedDepartments,
    showSkillGapsOnly,
    toggleDepartment,
    setShowSkillGapsOnly,
    reset,
  } = useFilterStore();

  const hasActiveFilters =
    selectedDepartments.length > 0 || showSkillGapsOnly;

  return (
    <div
      className="glass-card"
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} color="var(--color-accent)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            className="btn-ghost"
            onClick={reset}
            style={{ fontSize: 11, padding: '3px 8px' }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Departments */}
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Departments
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {departments.map((dept) => {
            const isSelected = selectedDepartments.includes(dept);
            const color = DEPT_COLORS[dept] ?? '#6378ff';
            return (
              <button
                key={dept}
                id={`filter-dept-${dept.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => toggleDepartment(dept)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? color + '50' : 'rgba(99,120,255,0.12)'}`,
                  background: isSelected ? color + '15' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: isSelected ? color : 'rgba(99,120,255,0.25)',
                    flexShrink: 0,
                    boxShadow: isSelected ? `0 0 8px ${color}80` : 'none',
                    transition: 'all 0.2s',
                  }}
                />
                <span style={{ fontSize: 13, color: isSelected ? color : 'var(--color-text-secondary)', fontWeight: isSelected ? 500 : 400 }}>
                  {dept}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Gap Toggle */}
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Highlight
        </p>
        <button
          id="filter-skill-gaps"
          onClick={() => setShowSkillGapsOnly(!showSkillGapsOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '7px 10px',
            borderRadius: 8,
            border: `1px solid ${showSkillGapsOnly ? 'rgba(239,68,68,0.4)' : 'rgba(99,120,255,0.12)'}`,
            background: showSkillGapsOnly ? 'rgba(239,68,68,0.12)' : 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <AlertTriangle size={14} color={showSkillGapsOnly ? '#ef4444' : 'var(--color-text-muted)'} />
          <span style={{ fontSize: 13, color: showSkillGapsOnly ? '#ef4444' : 'var(--color-text-secondary)', fontWeight: showSkillGapsOnly ? 500 : 400 }}>
            Skill Gap Clusters
          </span>
        </button>
      </div>

      {/* Legend */}
      <div style={{ paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Legend
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { color: '#6378ff', label: 'Normal employee' },
            { color: '#ef4444', label: 'Skill gap detected' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}80` }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
