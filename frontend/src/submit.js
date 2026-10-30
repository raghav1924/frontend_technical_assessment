// submit.js
// VectorShift Backend Integration & Pipeline Analysis Alert

import React, { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Send nodes and edges to the FastAPI backend endpoint
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const { num_nodes, num_edges, is_dag } = data;

      // 1. User-friendly browser alert
      const alertMessage =
        `📊 Pipeline Analysis Result:\n\n` +
        `• Number of Nodes: ${num_nodes}\n` +
        `• Number of Edges: ${num_edges}\n` +
        `• Is a DAG: ${is_dag ? 'Yes (Valid Acyclic Graph)' : 'No (Contains Cycles)'}`;

      alert(alertMessage);

      // 2. Also set modal data for the minimalist enterprise result dialog
      setModalData(data);
    } catch (error) {
      console.warn('Backend request failed:', error);

      // Client-side fallback check if the backend server is not running yet
      const isDagClient = checkIsDAGClient(nodes, edges);
      const fallbackData = {
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag: isDagClient,
      };

      const alertMessage =
        `📊 Pipeline Analysis Result (Client-side calculated):\n\n` +
        `• Number of Nodes: ${fallbackData.num_nodes}\n` +
        `• Number of Edges: ${fallbackData.num_edges}\n` +
        `• Is a DAG: ${fallbackData.is_dag ? 'Yes (Valid Acyclic Graph)' : 'No (Contains Cycles)'}\n\n` +
        `(Note: Start the FastAPI backend with 'uvicorn main:app --reload' in /backend to connect directly)`;

      alert(alertMessage);
      setModalData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Bar at bottom_center */}
      <div className="vs-floating-action-bar">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="vs-btn-analyze"
        >
          <span>{loading ? 'Analyzing...' : 'Analyze Pipeline'}</span>
          <span style={{ opacity: 0.6 }}>&rarr;</span>
        </button>
      </div>

      {/* Minimal Enterprise Result Modal */}
      {modalData && (
        <div
          className="vs-modal-backdrop"
          onClick={() => setModalData(null)}
        >
          <div
            className="vs-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vs-modal-header">
              <div className="vs-modal-title">Pipeline Analysis</div>
              <button
                type="button"
                className="vs-modal-close"
                onClick={() => setModalData(null)}
              >
                &times;
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="vs-metrics-grid">
              <div className="vs-metric-card">
                <div className="vs-metric-label">Nodes</div>
                <div className="vs-metric-value">{modalData.num_nodes}</div>
              </div>
              <div className="vs-metric-card">
                <div className="vs-metric-label">Edges</div>
                <div className="vs-metric-value">{modalData.num_edges}</div>
              </div>
              <div className="vs-metric-card">
                <div className="vs-metric-label">DAG</div>
                <div
                  className="vs-metric-value"
                  style={{
                    color: modalData.is_dag ? '#059669' : '#DC2626',
                  }}
                >
                  {modalData.is_dag ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`vs-modal-status ${
                modalData.is_dag ? 'valid' : 'invalid'
              }`}
            >
              <span>{modalData.is_dag ? '✓' : '⚠'}</span>
              <span>
                {modalData.is_dag
                  ? 'Pipeline is a valid directed acyclic graph'
                  : 'Pipeline contains a cycle'}
              </span>
            </div>

            {/* Footer */}
            <div className="vs-modal-footer">
              <button
                type="button"
                className="vs-modal-btn"
                onClick={() => setModalData(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Client-side helper for fallback
function checkIsDAGClient(nodes, edges) {
  if (!nodes || nodes.length === 0) return true;
  const adj = {};
  const inDegree = {};

  nodes.forEach((n) => {
    adj[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    if (adj[e.source] && inDegree[e.target] !== undefined) {
      adj[e.source].push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }
  });

  const queue = [];
  nodes.forEach((n) => {
    if (inDegree[n.id] === 0) queue.push(n.id);
  });

  let visited = 0;
  while (queue.length > 0) {
    const curr = queue.shift();
    visited += 1;
    (adj[curr] || []).forEach((nbr) => {
      inDegree[nbr] -= 1;
      if (inDegree[nbr] === 0) queue.push(nbr);
    });
  }

  return visited === nodes.length;
}
