// databaseNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const DatabaseNode = ({ id, data, selected }) => {
  const [dbType, setDbType] = useState(data?.dbType || 'Pinecone');
  const [collection, setCollection] = useState(data?.collection || 'documents');
  const [topK, setTopK] = useState(data?.topK || 5);

  const handleDbTypeChange = (e) => {
    setDbType(e.target.value);
  };

  const handleCollectionChange = (e) => {
    setCollection(e.target.value);
  };

  const handleTopKChange = (e) => {
    setTopK(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Database"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-query`,
          style: { top: '35%' },
          title: 'Vector / Query Text',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-filter`,
          style: { top: '70%' },
          title: 'Metadata Filter',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-results`,
          title: 'Query Results',
        },
      ]}
    >
      <label>
        Database:
        <select value={dbType} onChange={handleDbTypeChange}>
          <option value="Pinecone">Pinecone</option>
          <option value="ChromaDB">ChromaDB</option>
          <option value="PostgreSQL">PostgreSQL</option>
          <option value="Weaviate">Weaviate</option>
        </select>
      </label>
      <label>
        Collection / Table:
        <input
          type="text"
          value={collection}
          onChange={handleCollectionChange}
        />
      </label>
      <label>
        Top K:
        <input
          type="number"
          min="1"
          max="100"
          value={topK}
          onChange={handleTopKChange}
        />
      </label>
    </BaseNode>
  );
};
