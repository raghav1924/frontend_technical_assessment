// jsonTransformNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const JSONTransformNode = ({ id, data, selected }) => {
  const [operation, setOperation] = useState(data?.operation || 'Map');
  const [field, setField] = useState(data?.field || 'data.items');

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };

  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="🧩 JSON Transform"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`,
          title: 'Input JSON',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
          title: 'Transformed Output',
        },
      ]}
    >
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="Map">Map</option>
          <option value="Filter">Filter</option>
          <option value="Extract Field">Extract Field</option>
          <option value="Flatten">Flatten</option>
          <option value="JSON Stringify">JSON Stringify</option>
        </select>
      </label>
      <label>
        Field:
        <input
          type="text"
          placeholder="e.g. data.items"
          value={field}
          onChange={handleFieldChange}
        />
      </label>
    </BaseNode>
  );
};

