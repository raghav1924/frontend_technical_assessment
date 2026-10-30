// emailNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const EmailNode = ({ id, data, selected }) => {
  const [service, setService] = useState(data?.service || 'SendGrid');
  const [subject, setSubject] = useState(data?.subject || 'Workflow Alert');

  const handleServiceChange = (e) => {
    setService(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Email"
      selected={selected}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-recipient`,
          style: { top: '35%' },
          title: 'Recipient Address',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-message`,
          style: { top: '70%' },
          title: 'Email Content',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-status`,
          title: 'Send Status',
        },
      ]}
    >
      <label>
        Provider:
        <select value={service} onChange={handleServiceChange}>
          <option value="SendGrid">SendGrid</option>
          <option value="SMTP">SMTP Server</option>
          <option value="Mailgun">Mailgun</option>
          <option value="AWS SES">AWS SES</option>
        </select>
      </label>
      <label>
        Subject:
        <input
          type="text"
          placeholder="Subject line..."
          value={subject}
          onChange={handleSubjectChange}
        />
      </label>
    </BaseNode>
  );
};
