// baseNode.js
// Reusable Base Node Wrapper for ReactFlow custom nodes

import React from 'react';
import { Handle, Position } from 'reactflow';
import './baseNode.css';

const resolveHandlePosition = (handle) => {
  if (handle.position) return handle.position;
  return handle.type === 'target' ? Position.Left : Position.Right;
};

export const BaseNode = ({
  id,
  title,
  subtitle,
  icon,
  handles = [],
  children,
  fields,
  selected = false,
  className = '',
  style = {},
  headerStyle = {},
  bodyStyle = {},
  headerActions,
  footer,
}) => {
  // Group handles by position to automatically space them when top/left is not explicitly set
  const handlesByPosition = {
    [Position.Left]: [],
    [Position.Right]: [],
    [Position.Top]: [],
    [Position.Bottom]: [],
  };

  handles.forEach((handle, index) => {
    const pos = resolveHandlePosition(handle);
    if (!handlesByPosition[pos]) {
      handlesByPosition[pos] = [];
    }
    handlesByPosition[pos].push({ handle, originalIndex: index });
  });

  const computedHandles = [];

  Object.entries(handlesByPosition).forEach(([pos, group]) => {
    const count = group.length;
    group.forEach(({ handle, originalIndex }, idx) => {
      const isVertical = pos === Position.Left || pos === Position.Right;
      const offsetProp = isVertical ? 'top' : 'left';
      const defaultOffset = {};

      // If style does not specify offset and there are multiple handles on the same side, evenly distribute them
      if (!handle.style || handle.style[offsetProp] === undefined) {
        if (count > 1) {
          defaultOffset[offsetProp] = `${((idx + 1) * 100) / (count + 1)}%`;
        }
      }

      // Handle ID resolution: ensure handle ID is scoped to node id (or preserved if already scoped)
      const handleId = handle.id
        ? handle.id.startsWith(`${id}-`)
          ? handle.id
          : `${id}-${handle.id}`
        : `${id}-${handle.type || 'handle'}-${originalIndex}`;

      computedHandles.push({
        ...handle,
        resolvedId: handleId,
        resolvedPosition: pos,
        computedStyle: {
          ...defaultOffset,
          ...handle.style,
        },
      });
    });
  });

  return (
    <div
      className={`base-node ${selected ? 'selected' : ''} ${className}`}
      style={style}
    >
      {/* Handles */}
      {computedHandles.map((handle, i) => (
        <Handle
          key={handle.resolvedId || i}
          type={handle.type || 'source'}
          position={handle.resolvedPosition}
          id={handle.resolvedId}
          className={`base-node-handle ${handle.className || ''}`}
          style={handle.computedStyle}
        />
      ))}

      {/* Header */}
      {(title || icon || subtitle || headerActions) && (
        <div className="base-node-header" style={headerStyle}>
          <div className="base-node-title-group">
            {icon && <span className="base-node-icon">{icon}</span>}
            <div>
              {title && <div className="base-node-title">{title}</div>}
              {subtitle && <div className="base-node-subtitle">{subtitle}</div>}
            </div>
          </div>
          {headerActions && (
            <div className="base-node-header-actions">{headerActions}</div>
          )}
        </div>
      )}

      {/* Body: renders declarative fields and/or custom inputs/selects passed as children */}
      <div className="base-node-body" style={bodyStyle}>
        {Array.isArray(fields) &&
          fields.map((field, idx) => {
            if (field.render) {
              return <React.Fragment key={idx}>{field.render()}</React.Fragment>;
            }

            if (field.type === 'select') {
              return (
                <NodeField key={field.name || idx} label={field.label}>
                  <NodeSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={field.options}
                  />
                </NodeField>
              );
            }

            return (
              <NodeField key={field.name || idx} label={field.label}>
                <NodeInput
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                />
              </NodeField>
            );
          })}

        {children}
      </div>

      {/* Footer */}
      {footer && <div className="base-node-footer">{footer}</div>}
    </div>
  );
};

// Reusable helper components for node form fields
export const NodeField = ({ label, children, style = {}, className = '' }) => (
  <label className={`base-node-field ${className}`} style={style}>
    {label && <span className="base-node-field-label">{label}</span>}
    {children}
  </label>
);

export const NodeInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  style = {},
  className = '',
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`base-node-input ${className}`}
    style={style}
    {...props}
  />
);

export const NodeSelect = ({
  value,
  onChange,
  options = [],
  children,
  style = {},
  className = '',
  ...props
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`base-node-select ${className}`}
    style={style}
    {...props}
  >
    {options && options.length > 0
      ? options.map((opt, i) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val !== undefined ? val : i} value={val}>
              {lbl}
            </option>
          );
        })
      : children}
  </select>
);

export default BaseNode;

