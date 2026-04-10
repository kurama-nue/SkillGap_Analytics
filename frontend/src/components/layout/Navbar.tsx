/**
 * Navbar component with gradient brand logo and navigation links.
 */
import { Brain, BarChart3, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', icon: <Brain size={16} />, label: 'RAG Chat' },
    { to: '/analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(8, 12, 20, 0.85)',
        borderBottom: '1px solid rgba(99, 120, 255, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6378ff, #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Layers size={18} color="white" />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.02em',
          }}
          className="text-gradient"
        >
          SkillGap Analytics
        </span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            marginLeft: 4,
            fontFamily: 'var(--font-mono)',
          }}
        >
          HR Intelligence Platform
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              color: pathname === to ? '#818cf8' : 'var(--color-text-secondary)',
              background: pathname === to ? 'rgba(99, 120, 255, 0.12)' : 'transparent',
              border: pathname === to ? '1px solid rgba(99, 120, 255, 0.25)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {icon} {label}
          </Link>
        ))}
      </div>

      {/* Status badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--color-success)',
            boxShadow: '0 0 8px rgba(16, 217, 138, 0.5)',
            display: 'inline-block',
          }}
        />
        Backend connected
      </div>
    </nav>
  );
}
