// submit.js

import React from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    // In Part 4, this triggers POST /pipelines/parse
    // For now, it logs and alerts or confirms readiness
    alert(`Pipeline ready: ${nodes.length} nodes, ${edges.length} edges`);
  };

  return (
    <footer className="vs-statusbar">
      <div className="vs-status-left">
        <div className="vs-status-item">
          <span className="vs-status-tag">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Active Studio
          </span>
        </div>
        <div className="vs-status-item">
          <span>Nodes:</span>
          <span className="vs-status-count">{nodes.length}</span>
        </div>
        <div className="vs-status-item">
          <span>Edges:</span>
          <span className="vs-status-count">{edges.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          className="vs-btn-primary"
        >
          <span>Run Pipeline</span>
          <span>&rarr;</span>
          <kbd className="vs-btn-kbd">&#8984;&crarr;</kbd>
        </button>
      </div>
    </footer>
  );
};
