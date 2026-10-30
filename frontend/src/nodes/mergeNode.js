// mergeNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const MergeNode = ({ id, data, selected }) => {
  const [mode, setMode] = useState(data?.mode || 'Combine');

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Merge"
      accent="#EC4899"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-inputA`,
          title: 'Input A',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-inputB`,
          title: 'Input B',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
          title: 'Merged Output',
        },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#85847F',
          marginBottom: '2px',
        }}
      >
        <span>● Input A</span>
        <span>Output ●</span>
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#85847F',
          marginBottom: '6px',
        }}
      >
        <span>● Input B</span>
      </div>
      <label>
        Merge Mode
        <select value={mode} onChange={handleModeChange}>
          <option value="Combine">Combine Objects</option>
          <option value="Append">Append Arrays</option>
          <option value="WaitBoth">Wait for Both</option>
          <option value="PassFirst">Pass First</option>
        </select>
      </label>
    </BaseNode>
  );
};
