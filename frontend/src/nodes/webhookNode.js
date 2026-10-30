// webhookNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const WebhookNode = ({ id, data, selected }) => {
  const [method, setMethod] = useState(data?.method || 'POST');
  const [path, setPath] = useState(data?.path || '/webhook/test');

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handlePathChange = (e) => {
    setPath(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Webhook"
      accent="#84CC16"
      selected={selected}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
          title: 'Webhook Output',
        },
      ]}
    >
      <label>
        HTTP Method
        <select value={method} onChange={handleMethodChange}>
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
      </label>
      <label>
        Path
        <input
          type="text"
          placeholder="/webhook/path"
          value={path}
          onChange={handlePathChange}
        />
      </label>
    </BaseNode>
  );
};
