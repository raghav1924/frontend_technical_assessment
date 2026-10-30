// transformNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const TransformNode = ({ id, data, selected }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'JSON Parse');
  const [keyPath, setKeyPath] = useState(data?.keyPath || '');

  const handleTransformChange = (e) => {
    setTransformType(e.target.value);
  };

  const handleKeyPathChange = (e) => {
    setKeyPath(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Transform"
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
          id: `${id}-output`,
          title: 'Transformed Output',
        },
      ]}
    >
      <label>
        Transform:
        <select value={transformType} onChange={handleTransformChange}>
          <option value="JSON Parse">JSON Parse</option>
          <option value="JSON Stringify">JSON Stringify</option>
          <option value="To Uppercase">To Uppercase</option>
          <option value="To Lowercase">To Lowercase</option>
          <option value="Trim">Trim</option>
          <option value="Extract Key">Extract Key</option>
        </select>
      </label>
      {transformType === 'Extract Key' && (
        <label>
          Key / Path:
          <input
            type="text"
            placeholder="e.g. data.items[0]"
            value={keyPath}
            onChange={handleKeyPathChange}
          />
        </label>
      )}
    </BaseNode>
  );
};
