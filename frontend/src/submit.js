// submit.js
// VectorShift Analyze Pipeline Action & Minimal Enterprise Result Dialog

import React, { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

// Check if graph is a Directed Acyclic Graph (DAG) using Kahn's algorithm
const checkIsDAG = (nodes, edges) => {
  if (!nodes || nodes.length === 0) return true;
  const adj = {};
  const inDegree = {};

  nodes.forEach((node) => {
    adj[node.id] = [];
    inDegree[node.id] = 0;
  });

  edges.forEach((edge) => {
    if (adj[edge.source] && inDegree[edge.target] !== undefined) {
      adj[edge.source].push(edge.target);
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    }
  });

  const queue = [];
  nodes.forEach((node) => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  });

  let visited = 0;
  while (queue.length > 0) {
    const curr = queue.shift();
    visited += 1;
    (adj[curr] || []).forEach((neighbor) => {
      inDegree[neighbor] -= 1;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return visited === nodes.length;
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    const isDag = checkIsDAG(nodes, edges);
    setAnalysis({
      numNodes: nodes.length,
      numEdges: edges.length,
      isDag,
    });
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Submit Action at bottom_center */}
      <div className="vs-floating-action-bar">
        <button
          type="button"
          onClick={handleAnalyze}
          className="vs-btn-analyze"
        >
          <span>Analyze Pipeline</span>
          <span style={{ opacity: 0.6 }}>&rarr;</span>
        </button>
      </div>

      {/* Minimal Enterprise Result Modal */}
      {isOpen && analysis && (
        <div
          className="vs-modal-backdrop"
          onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="vs-metrics-grid">
              <div className="vs-metric-card">
                <div className="vs-metric-label">Nodes</div>
                <div className="vs-metric-value">{analysis.numNodes}</div>
              </div>
              <div className="vs-metric-card">
                <div className="vs-metric-label">Edges</div>
                <div className="vs-metric-value">{analysis.numEdges}</div>
              </div>
              <div className="vs-metric-card">
                <div className="vs-metric-label">DAG</div>
                <div
                  className="vs-metric-value"
                  style={{
                    color: analysis.isDag ? '#059669' : '#DC2626',
                  }}
                >
                  {analysis.isDag ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`vs-modal-status ${
                analysis.isDag ? 'valid' : 'invalid'
              }`}
            >
              <span>{analysis.isDag ? '✓' : '⚠'}</span>
              <span>
                {analysis.isDag
                  ? 'Pipeline is a valid directed acyclic graph'
                  : 'Pipeline contains a cycle'}
              </span>
            </div>

            {/* Footer */}
            <div className="vs-modal-footer">
              <button
                type="button"
                className="vs-modal-btn"
                onClick={() => setIsOpen(false)}
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
