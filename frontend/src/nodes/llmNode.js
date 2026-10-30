// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-system`,
          style: { top: `${100 / 3}%` },
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-prompt`,
          style: { top: `${200 / 3}%` },
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
        },
      ]}
    >
      <div style={{ fontSize: '12px', color: '#475569', padding: '4px 0' }}>
        <span>This is a LLM.</span>
      </div>
    </BaseNode>
  );
};
