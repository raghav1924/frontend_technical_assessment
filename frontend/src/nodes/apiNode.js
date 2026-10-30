// apiNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const APINode = ({ id, data, selected }) => {
  const [method, setMethod] = useState(data?.method || 'POST');
  const [endpoint, setEndpoint] = useState(data?.endpoint || 'https://api.example.com/data');

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="API Request"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-url`,
          style: { top: '35%' },
          title: 'URL / Query Params',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-body`,
          style: { top: '70%' },
          title: 'Request Body',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
          style: { top: '35%' },
          title: 'Response Body',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-status`,
          style: { top: '70%' },
          title: 'Status Code',
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
        Endpoint:
        <input
          type="text"
          placeholder="https://..."
          value={endpoint}
          onChange={handleEndpointChange}
        />
      </label>
    </BaseNode>
  );
};
