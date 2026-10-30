// filterNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const FilterNode = ({ id, data, selected }) => {
  const [condition, setCondition] = useState(data?.condition || 'Contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Filter"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`,
          title: 'Input Data',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-true`,
          style: { top: '35%' },
          title: 'Condition Met (True)',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-false`,
          style: { top: '70%' },
          title: 'Condition Not Met (False)',
        },
      ]}
    >
      <label>
        Condition:
        <select value={condition} onChange={handleConditionChange}>
          <option value="Contains">Contains</option>
          <option value="Equals">Equals</option>
          <option value="Starts With">Starts With</option>
          <option value="Greater Than">Greater Than</option>
          <option value="Regex">Regex Match</option>
        </select>
      </label>
      <label>
        Value:
        <input
          type="text"
          placeholder="Filter value..."
          value={filterValue}
          onChange={handleFilterValueChange}
        />
      </label>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#64748b',
          marginTop: '2px',
          paddingRight: '4px',
        }}
      >
        <span>in</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>true / false</span>
      </div>
    </BaseNode>
  );
};
