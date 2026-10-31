// textNode.js
// VectorShift Text Node with Dynamic Auto-Resize & Variable Extraction

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

// Valid JavaScript identifier regex: starts with letter/$/_, followed by alphanumeric/$/_
const JS_IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

// Extracts unique valid variables from {{ variableName }} patterns
const extractVariables = (text) => {
  if (!text) return [];
  const regex = /\{\{\s*([a-zA-Z0-9_$]+)\s*\}\}/g;
  const matches = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1];
    if (JS_IDENTIFIER_REGEX.test(varName)) {
      matches.add(varName);
    }
  }
  return Array.from(matches);
};

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const [nodeDimensions, setNodeDimensions] = useState({ width: 240, height: 110 });
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    const extracted = extractVariables(val);
    setVariables(extracted);
  };

  // Auto-resize width and height based on text content
  useEffect(() => {
    if (!textareaRef.current) return;

    // Reset height to calculate scrollHeight accurately
    textareaRef.current.style.height = 'auto';
    const scrollHeight = textareaRef.current.scrollHeight;

    // Calculate line lengths to dynamically expand width
    const lines = currText.split('\n');
    const maxLineLength = Math.max(...lines.map((l) => l.length), 10);
    const computedWidth = Math.min(Math.max(maxLineLength * 8 + 40, 220), 420);
    const computedHeight = Math.min(Math.max(scrollHeight + 48, 100), 320);

    setNodeDimensions({ width: computedWidth, height: computedHeight });
  }, [currText]);

  // Build handles: dynamic target handle for each variable on Left, plus 1 output handle on Right
  const handles = [
    ...variables.map((varName) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${varName}`,
      title: `Variable: {{ ${varName} }}`,
    })),
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
      title: 'Text Output',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      accent="#C084FC"
      selected={selected}
      handles={handles}
      style={{
        width: `${nodeDimensions.width}px`,
        minHeight: `${nodeDimensions.height}px`,
        transition: 'width 0.15s ease-out, min-height 0.15s ease-out',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#85847F',
          }}
        >
          Text Content
        </span>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          placeholder="Enter text or {{ variable }}..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '13px',
            lineHeight: 1.5,
            width: '100%',
            fontFamily: 'inherit',
            color: 'inherit',
            padding: '2px 0',
          }}
          rows={Math.max(currText.split('\n').length, 2)}
        />
        {variables.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              paddingTop: '6px',
              borderTop: '1px solid var(--vs-border, #D8D5CC)',
            }}
          >
            {variables.map((v) => (
              <span
                key={v}
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--vs-text-secondary, #5F6064)',
                  backgroundColor: 'var(--vs-tag-bg, #F0EEE7)',
                  padding: '1px 6px',
                  borderRadius: '3px',
                }}
              >
                {`{{ ${v} }}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
