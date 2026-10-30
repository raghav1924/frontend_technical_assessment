// toolbar.js
// VectorShift Left Sidebar (260px) with Categorized Node Picker

import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <aside className="vs-sidebar">
      {/* TRIGGERS */}
      <div className="vs-sidebar-section">
        <div className="vs-sidebar-section-title">Triggers</div>
        <div className="vs-sidebar-node-list">
          <DraggableNode
            type="customInput"
            label="Input"
            accent="#7C83FD"
          />
          <DraggableNode
            type="webhook"
            label="Webhook"
            accent="#84CC16"
          />
        </div>
      </div>

      {/* AI */}
      <div className="vs-sidebar-section">
        <div className="vs-sidebar-section-title">AI</div>
        <div className="vs-sidebar-node-list">
          <DraggableNode
            type="llm"
            label="LLM"
            accent="#A78BFA"
          />
          <DraggableNode
            type="text"
            label="Text"
            accent="#C084FC"
          />
        </div>
      </div>

      {/* DATA */}
      <div className="vs-sidebar-section">
        <div className="vs-sidebar-section-title">Data</div>
        <div className="vs-sidebar-node-list">
          <DraggableNode
            type="httpRequest"
            label="HTTP Request"
            accent="#60A5FA"
          />
          <DraggableNode
            type="jsonTransform"
            label="JSON Transform"
            accent="#14B8A6"
          />
        </div>
      </div>

      {/* LOGIC */}
      <div className="vs-sidebar-section">
        <div className="vs-sidebar-section-title">Logic</div>
        <div className="vs-sidebar-node-list">
          <DraggableNode
            type="ifCondition"
            label="Condition"
            accent="#F59E0B"
          />
          <DraggableNode
            type="merge"
            label="Merge"
            accent="#EC4899"
          />
        </div>
      </div>

      {/* OUTPUT */}
      <div className="vs-sidebar-section">
        <div className="vs-sidebar-section-title">Output</div>
        <div className="vs-sidebar-node-list">
          <DraggableNode
            type="customOutput"
            label="Output"
            accent="#34D399"
          />
        </div>
      </div>
    </aside>
  );
};
