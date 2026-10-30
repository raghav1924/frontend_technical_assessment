// App.js
// VectorShift Pipeline Builder Main Application

import React, { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  const [activeTab, setActiveTab] = useState('Build');

  return (
    <div className="vs-app-container">
      {/* Header (64px) */}
      <header className="vs-header">
        <div className="vs-header-left">
          <a
            href="/"
            className="vs-logo"
            onClick={(e) => e.preventDefault()}
          >
            VectorShift
          </a>
        </div>

        {/* Center Navigation */}
        <nav className="vs-header-nav">
          {['Build', 'Templates', 'Nodes'].map((tab) => (
            <span
              key={tab}
              className={`vs-header-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="vs-header-right">
          <a
            href="#help"
            className="vs-header-action-link"
            onClick={(e) => e.preventDefault()}
          >
            Help
          </a>
          <a
            href="#settings"
            className="vs-header-action-link"
            onClick={(e) => e.preventDefault()}
          >
            Settings
          </a>
        </div>
      </header>

      {/* Main Layout (260px sidebar + 1fr canvas) */}
      <div className="vs-main-layout">
        {/* Left Sidebar (260px) */}
        <PipelineToolbar />

        {/* Canvas Area */}
        <main style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
          <PipelineUI />
          <SubmitButton />
        </main>
      </div>
    </div>
  );
}

export default App;
