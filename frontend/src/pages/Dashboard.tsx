/**
 * Dashboard page — Split layout: 3D galaxy (left) + RAG chat (right)
 */
import { SkillGalaxy } from '../components/visualization/SkillGalaxy';
import { ChatInterface } from '../components/chat/ChatInterface';

export function Dashboard() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: 16,
        height: 'calc(100vh - 60px)',
        padding: '76px 20px 16px',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 3D Skill Galaxy */}
      <div
        className="glass-card"
        style={{ overflow: 'hidden', position: 'relative', minHeight: 0 }}
      >
        <SkillGalaxy />
      </div>

      {/* Chat interface */}
      <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <ChatInterface />
      </div>
    </div>
  );
}
