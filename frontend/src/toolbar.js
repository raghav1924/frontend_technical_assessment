// toolbar.js
// VectorShift Left Sidebar with Compact Search & Icon Category Tabs

import React, { useState, useMemo } from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';

// Sidebar Toggle Icon matching VectorShift design (Image 2)
export const SidebarToggleIcon = ({ isCollapsed }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="3.5" ry="3.5" />
    <line x1="9" y1="3" x2="9" y2="21" />
    {isCollapsed ? (
      <polyline points="13 9 16 12 13 15" />
    ) : (
      <polyline points="15 9 12 12 15 15" />
    )}
  </svg>
);

// Category Icons (compact SVG icons)
const AllIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const GeneralIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const LLMTabIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const TriggersIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DataIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const LogicIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

// Categories config with icons
const CATEGORIES = [
  { id: 'All', label: 'All', Icon: AllIcon },
  { id: 'General', label: 'General', Icon: GeneralIcon },
  { id: 'LLMs', label: 'LLMs', Icon: LLMTabIcon },
  { id: 'Triggers', label: 'Triggers', Icon: TriggersIcon },
  { id: 'Data', label: 'Data', Icon: DataIcon },
  { id: 'Logic', label: 'Logic', Icon: LogicIcon },
];

// Master nodes list
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

export const PipelineToolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  // Filter nodes based on search query and selected category tab
  const filteredNodes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return NODES_DATA.filter((node) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'All' || node.category === activeCategory;

      if (!matchesCategory) return false;

      // Search query filter
      if (!query) return true;

      const matchesLabel = node.label.toLowerCase().includes(query);
      const matchesType = node.type.toLowerCase().includes(query);
      const matchesCat = node.category.toLowerCase().includes(query);
      const matchesTags = node.tags.some((t) => t.toLowerCase().includes(query));

      return matchesLabel || matchesType || matchesCat || matchesTags;
    });
  }, [searchTerm, activeCategory]);

  return (
    <aside
      className={`vs-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}
      aria-hidden={!isSidebarOpen}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="vs-sidebar-top-bar">
        <span className="vs-sidebar-top-title">Nodes Library</span>
        <button
          type="button"
          className="vs-sidebar-close-btn"
          onClick={toggleSidebar}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* 1. Compact Search Bar */}
      <div className="vs-search-box">
        <svg
          className="vs-search-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
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

      {/* 2. Small Category Bar with Icons */}
      <div className="vs-tabs-bar">
        {CATEGORIES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`vs-tab-item ${activeCategory === id ? 'active' : ''}`}
            onClick={() => setActiveCategory(id)}
            title={label}
          >
            <span className="vs-tab-icon">
              <Icon />
            </span>
            <span className="vs-tab-label">{label}</span>
          </button>
        ))}
      </div>

      {/* 3. Node Grid (Compact Square Cards) */}
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
