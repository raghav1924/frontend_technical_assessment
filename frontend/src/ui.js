// ui.js
// VectorShift Canvas & ReactFlow Setup

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Panel, Background, MiniMap, MarkerType, useViewport, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { HTTPRequestNode } from './nodes/httpRequestNode';
import { IFConditionNode } from './nodes/ifNode';
import { JSONTransformNode } from './nodes/jsonTransformNode';
import { MergeNode } from './nodes/mergeNode';
import { WebhookNode } from './nodes/webhookNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Custom Minimalist VectorShift Canvas Controls (Zoom In, % Zoom, Zoom Out, Fit, Lock, Dark/Light Theme)
const CanvasControls = () => {
  const { zoomIn, zoomOut, fitView, zoomTo } = useReactFlow();
  const { zoom } = useViewport();
  const isLocked = useStore((state) => state.isLocked);
  const toggleLock = useStore((state) => state.toggleLock);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const zoomPercent = Math.round((zoom || 1) * 100);

  return (
    <Panel position="bottom-left" className="vs-canvas-controls">
      {/* 1. Zoom In */}
      <button
        type="button"
        className="vs-control-btn"
        onClick={() => zoomIn({ duration: 200 })}
        title="Zoom In"
        aria-label="Zoom In"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 2. Live Zoom Percentage (Click to Reset to 100%) */}
      <button
        type="button"
        className="vs-control-btn vs-zoom-pct-btn"
        onClick={() => zoomTo(1, { duration: 200 })}
        title={`Current Zoom: ${zoomPercent}% (Click to reset to 100%)`}
        aria-label="Reset zoom to 100%"
      >
        {zoomPercent}%
      </button>

      {/* 3. Zoom Out */}
      <button
        type="button"
        className="vs-control-btn"
        onClick={() => zoomOut({ duration: 200 })}
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 4. Fit View */}
      <button
        type="button"
        className="vs-control-btn"
        onClick={() => fitView({ padding: 0.25, duration: 250 })}
        title="Fit View"
        aria-label="Fit View"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

      {/* 5. Lock / Unlock Feature */}
      <button
        type="button"
        className={`vs-control-btn vs-lock-btn ${isLocked ? 'is-locked' : ''}`}
        onClick={toggleLock}
        title={isLocked ? 'Canvas is Locked (Click to Unlock)' : 'Lock Canvas (Freeze edits & moves)'}
        aria-label={isLocked ? 'Unlock canvas' : 'Lock canvas'}
      >
        {isLocked ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        )}
      </button>

      {/* 6. Dark / Light Background Change */}
      <button
        type="button"
        className="vs-control-btn vs-theme-btn"
        onClick={toggleTheme}
        title={isDarkMode ? 'Switch to Warm Ivory Light Mode' : 'Switch to Enterprise Dark Mode'}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </Panel>
  );
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#7C7B76', strokeWidth: 1.5 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 14,
    height: 14,
    color: '#7C7B76',
  },
};

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  httpRequest: HTTPRequestNode,
  ifCondition: IFConditionNode,
  jsonTransform: JSONTransformNode,
  merge: MergeNode,
  webhook: WebhookNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  isLocked: state.isLocked,
  isDarkMode: state.isDarkMode,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    isLocked,
    isDarkMode,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (isLocked) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID, isLocked]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className={`vs-canvas-container ${isLocked ? 'is-canvas-locked' : ''}`}
    >
      {/* Floating Canvas Lock Status Indicator */}
      {isLocked && (
        <div className="vs-canvas-lock-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Canvas is locked
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={isLocked ? [] : ['Backspace', 'Delete']}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
      >
        <Background
          color={isDarkMode ? '#232B36' : '#DDD9D0'}
          gap={gridSize}
          size={1.5}
          style={{ opacity: isDarkMode ? 0.75 : 0.55 }}
        />
        <CanvasControls />
        <MiniMap
          position="bottom-right"
          nodeStrokeWidth={2}
          nodeColor={() => (isDarkMode ? '#374151' : '#D8D5CC')}
          maskColor={isDarkMode ? 'rgba(13, 18, 24, 0.75)' : 'rgba(247, 244, 236, 0.75)'}
          style={{
            background: isDarkMode ? '#141A22' : '#FBFAF5',
            border: `1px solid ${isDarkMode ? '#232B36' : '#D8D5CC'}`,
            borderRadius: '4px',
          }}
        />
      </ReactFlow>
    </div>
  );
};
