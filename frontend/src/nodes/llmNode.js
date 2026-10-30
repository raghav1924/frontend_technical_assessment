// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      accent="#A78BFA"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-system`,
          title: 'System Prompt',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-prompt`,
          title: 'User Prompt',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
          title: 'LLM Response',
        },
      ]}
    >
      <div style={{ fontSize: '12px', color: '#5F6064', padding: '2px 0' }}>
        <span>Generates text via foundation model.</span>
      </div>
    </BaseNode>
  );
};
