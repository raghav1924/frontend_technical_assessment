// draggableNode.js
// VectorShift Node Picker Tile

import React from 'react';

export const DraggableNode = ({ type, label, accent = '#111318', icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`vs-node-tile ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <span
        className="vs-node-tile-accent"
        style={{ backgroundColor: accent }}
      />
      {icon && <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>}
      <span className="vs-node-tile-label">{label}</span>
    </div>
  );
};
