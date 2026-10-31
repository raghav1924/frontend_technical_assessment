// App.js
// VectorShift Pipeline Builder Main Application

import React, { useState, useEffect } from 'react';
import { PipelineToolbar, SidebarToggleIcon } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';

// Top Navbar Crisp SVG Icons
const BuildIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const TemplatesIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const NodesTabIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const HelpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const RocketIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
    <path d="M12 9v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('Build');
  const isDarkMode = useStore((state) => state.isDarkMode);
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  // Keyboard shortcut: Cmd+B or Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className={`vs-app-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Compact Top Navbar (46px) */}
      <header className="vs-header">
        {/* Left: Sidebar Toggle + Wordmark + Breadcrumb */}
        <div className="vs-header-left">
          <button
            type="button"
            className={`vs-sidebar-toggle-btn ${!isSidebarOpen ? 'is-collapsed' : ''}`}
            onClick={toggleSidebar}
            title={isSidebarOpen ? 'Collapse sidebar (Cmd+B)' : 'Expand sidebar (Cmd+B)'}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <SidebarToggleIcon isCollapsed={!isSidebarOpen} />
          </button>

          <a
            href="/"
            className="vs-logo"
            onClick={(e) => e.preventDefault()}
          >
            VectorShift
          </a>

          <span className="vs-header-divider">/</span>

          <div className="vs-header-breadcrumb">
            <span className="vs-breadcrumb-parent">Pipelines</span>
            <span className="vs-breadcrumb-chevron">›</span>
            <span className="vs-breadcrumb-current">Untitled Pipeline</span>
            <span className="vs-breadcrumb-badge">Draft</span>
          </div>
        </div>

        {/* Center: Compact Navigation Tabs with Icons */}
        <nav className="vs-header-nav">
          {[
            { id: 'Build', label: 'Build', Icon: BuildIcon },
            { id: 'Templates', label: 'Templates', Icon: TemplatesIcon },
            { id: 'Nodes', label: 'Nodes', Icon: NodesTabIcon },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`vs-header-nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Actions & Tools with Icons (Status, History, Help, Settings, Deploy) */}
        <div className="vs-header-right">
          <div className="vs-header-status-badge">
            <span className="vs-status-dot" />
            <span>Draft saved</span>
          </div>

          <button
            type="button"
            className="vs-header-icon-btn"
            title="Version history"
            aria-label="Version history"
            onClick={() => alert('VectorShift: Version history is up to date.')}
          >
            <HistoryIcon />
          </button>

          <button
            type="button"
            className="vs-header-icon-btn"
            title="Help & documentation"
            aria-label="Help & documentation"
            onClick={() => window.open('https://docs.vectorshift.ai', '_blank')}
          >
            <HelpIcon />
          </button>

          <button
            type="button"
            className="vs-header-icon-btn"
            title="Pipeline settings"
            aria-label="Pipeline settings"
            onClick={() => alert('VectorShift: Pipeline Settings')}
          >
            <SettingsIcon />
          </button>

          <button
            type="button"
            className="vs-header-deploy-btn"
            title="Deploy changes"
            aria-label="Deploy changes"
            onClick={() => alert('Pipeline deployed successfully!')}
          >
            <RocketIcon />
            <span>Deploy</span>
          </button>
        </div>
      </header>

      {/* Main Layout (Collapsible Sidebar + Canvas) */}
      <div className="vs-main-layout">
        {/* Left Sidebar (270px or Collapsed) */}
        <PipelineToolbar />

        {/* Canvas Area */}
        <main className="vs-main-canvas-wrapper">
          {/* Floating Expand Tab when Sidebar is Collapsed */}
          {!isSidebarOpen && (
            <button
              type="button"
              className="vs-canvas-expand-tab"
              onClick={toggleSidebar}
              title="Expand nodes library (Cmd+B)"
              aria-label="Expand nodes library"
            >
              <SidebarToggleIcon isCollapsed={true} />
              <span className="vs-expand-tab-text">Nodes</span>
            </button>
          )}
          <PipelineUI />
          <SubmitButton />
        </main>
      </div>
    </div>
  );
}

export default App;
