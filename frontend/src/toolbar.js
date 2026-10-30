// toolbar.js

import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        padding: '12px 24px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2DDD3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Section title in VectorShift signature style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8C827A',
            }}
          >
            Components &amp; Skills
          </span>
          <span style={{ fontSize: '11px', color: '#57534E', fontFamily: 'var(--vs-font-serif)', fontStyle: 'italic' }}>
            Drag nodes onto canvas
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#E2DDD3' }} />

        {/* Node Chips */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {/* General Nodes */}
          <DraggableNode type="customInput" label="Input" />
          <DraggableNode type="llm" label="LLM" />
          <DraggableNode type="customOutput" label="Output" />
          <DraggableNode type="text" label="Text" />

          <div style={{ width: '1px', height: '18px', backgroundColor: '#EDE9E1', margin: '0 4px' }} />

          {/* Logic & Transform */}
          <DraggableNode type="ifCondition" label="IF / Condition" />
          <DraggableNode type="merge" label="Merge" />
          <DraggableNode type="jsonTransform" label="JSON Transform" />

          <div style={{ width: '1px', height: '18px', backgroundColor: '#EDE9E1', margin: '0 4px' }} />

          {/* Integrations */}
          <DraggableNode type="httpRequest" label="HTTP Request" />
          <DraggableNode type="webhook" label="Webhook Trigger" />
        </div>
      </div>
    </div>
  );
};
