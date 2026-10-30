// httpRequestNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const HTTPRequestNode = ({ id, data, selected }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="🌐 HTTP Request"
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
          title: 'Output Response',
        },
      ]}
    >
      <label>
        Method:
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </label>
      <label>
        URL:
        <input
          type="text"
          placeholder="https://api.example.com"
          value={url}
          onChange={handleUrlChange}
        />
      </label>
    </BaseNode>
  );
};

