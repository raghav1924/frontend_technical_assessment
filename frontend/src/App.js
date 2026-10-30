// App.js

import React from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="vs-app">
      {/* Top Header / Navigation Bar matching VectorShift Brand */}
      <header className="vs-navbar">
        <div className="vs-nav-left">
          <div className="vs-logo">
            <span>VectorShift</span>
            <span className="vs-logo-dot" />
          </div>

          <div className="vs-divider-vertical" />

          <div className="vs-nav-title">
            <span className="vs-nav-title-main">Workflow Orchestration</span>
            <span className="vs-nav-title-sub">financial pipelines</span>
          </div>
        </div>

        <div className="vs-nav-links">
          <span className="vs-nav-badge">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#059669' }} />
            SOC 2 Type II
          </span>
          <a
            href="#docs"
            onClick={(e) => e.preventDefault()}
            className="vs-nav-link"
          >
            Documentation
          </a>
          <button
            type="button"
            className="vs-btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E2DDD3',
            }}
          >
            Request Demo
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="vs-workspace">
        <PipelineToolbar />
        <PipelineUI />
      </main>

      {/* Bottom Status & Execution Bar */}
      <SubmitButton />
    </div>
  );
}

export default App;
