// textNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Text"
      selected={selected}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
        },
      ]}
    >
      <label>
        Text:
        <input 
          type="text" 
          value={currText} 
          onChange={handleTextChange} 
        />
      </label>
    </BaseNode>
  );
};
