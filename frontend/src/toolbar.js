// toolbar.js
// VectorShift Left Sidebar with Real-Time Node Search and Category Tabs

import React, { useState, useMemo } from 'react';
import { DraggableNode } from './draggableNode';

// Master node list matching VectorShift categories
export const NODES_DATA = [
  // General
  { type: 'customInput', label: 'Input', category: 'General', tags: ['input', 'start', 'trigger', 'data'] },
  { type: 'customOutput', label: 'Output', category: 'General', tags: ['output', 'end', 'result', 'export'] },
  { type: 'text', label: 'Text', category: 'General', tags: ['text', 'string', 'prompt', 'variable', 'template'] },

  // LLMs
  { type: 'llm', label: 'LLM', category: 'LLMs', tags: ['llm', 'ai', 'gpt', 'model', 'openai', 'anthropic'] },

  // Triggers
  { type: 'webhook', label: 'Webhook', category: 'Triggers', tags: ['webhook', 'trigger', 'http', 'event', 'listener'] },

  // Data
  { type: 'httpRequest', label: 'HTTP Request', category: 'Data', tags: ['http', 'request', 'api', 'rest', 'fetch'] },
  { type: 'jsonTransform', label: 'JSON Transform', category: 'Data', tags: ['json', 'transform', 'map', 'filter', 'parse'] },

  // Logic
  { type: 'ifCondition', label: 'Condition', category: 'Logic', tags: ['if', 'condition', 'branch', 'filter', 'decision'] },
  { type: 'merge', label: 'Merge', category: 'Logic', tags: ['merge', 'combine', 'join', 'union'] },
];

const CATEGORIES = ['All', 'General', 'LLMs', 'Triggers', 'Data', 'Logic'];

export const PipelineToolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter nodes based on search query and selected category tab
  const filteredNodes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return NODES_DATA.filter((node) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'All' || node.category === activeCategory;

      if (!matchesCategory) return false;

      // Search query filter (matches label, type, category, or tags)
      if (!query) return true;

      const matchesLabel = node.label.toLowerCase().includes(query);
      const matchesType = node.type.toLowerCase().includes(query);
      const matchesCat = node.category.toLowerCase().includes(query);
      const matchesTags = node.tags.some((t) => t.toLowerCase().includes(query));

      return matchesLabel || matchesType || matchesCat || matchesTags;
    });
  }, [searchTerm, activeCategory]);

  return (
    <aside className="vs-sidebar">
      {/* 1. Search Nodes Input (as shown in screenshots) */}
      <div className="vs-search-box">
        <svg
          className="vs-search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search Nodes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="vs-search-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="vs-search-clear"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {/* 2. Category Tabs (General, LLMs, Triggers, Data, Logic) */}
      <div className="vs-tabs-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`vs-tab-item ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Node Grid (Square card tiles with icon on top, label on bottom) */}
      <div className="vs-sidebar-content">
        {filteredNodes.length > 0 ? (
          <div className="vs-nodes-grid">
            {filteredNodes.map((node) => (
              <DraggableNode
                key={node.type}
                type={node.type}
                label={node.label}
              />
            ))}
          </div>
        ) : (
          <div className="vs-no-results">
            <span>No nodes found matching</span>
            <strong>"{searchTerm}"</strong>
          </div>
        )}
      </div>
    </aside>
  );
};
