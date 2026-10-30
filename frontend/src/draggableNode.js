// draggableNode.js

import React from 'react';

const nodeIcons = {
  customInput: '📥',
  llm: '🤖',
  customOutput: '📤',
  text: '📝',
  httpRequest: '🌐',
  ifCondition: '🔀',
  jsonTransform: '🧩',
  merge: '🔗',
  webhook: '⚡',
};

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const displayIcon = icon || nodeIcons[type] || '◻️';

  return (
    <div
      className={`vs-draggable-node ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2DDD3',
        borderRadius: '7px',
        boxShadow: '0 1px 2px 0 rgba(17, 24, 39, 0.04)',
        transition: 'all 0.15s ease-in-out',
        userSelect: 'none',
      }}
      draggable
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{displayIcon}</span>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#111827',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};
