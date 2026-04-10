/**
 * Root App component with React Router routing.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <div
        className="bg-grid"
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg-primary)',
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
