// ifNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const IFConditionNode = ({ id, data, selected }) => {
  const [condition, setCondition] = useState(data?.condition || 'Greater Than');
  const [value, setValue] = useState(data?.value || '18');

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="🔀 IF / Condition"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`,
          title: 'Input Value',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-true`,
          style: { top: '35%' },
          title: 'True Output',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-false`,
          style: { top: '70%' },
          title: 'False Output',
        },
      ]}
    >
      <label>
        Condition:
        <select value={condition} onChange={handleConditionChange}>
          <option value="Greater Than">Greater Than (&gt;)</option>
          <option value="Less Than">Less Than (&lt;)</option>
          <option value="Equals">Equals (==)</option>
          <option value="Not Equals">Not Equals (!=)</option>
          <option value="Contains">Contains</option>
          <option value="Is Empty">Is Empty</option>
        </select>
      </label>
      <label>
        Compare Value:
        <input
          type="text"
          placeholder="Value to compare..."
          value={value}
          onChange={handleValueChange}
        />
      </label>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          fontSize: '10px',
          fontWeight: 600,
          marginTop: '2px',
          paddingRight: '2px',
        }}
      >
        <span style={{ color: '#10b981' }}>True ➔</span>
        <span style={{ color: '#ef4444' }}>False ➔</span>
      </div>
    </BaseNode>
  );
};

