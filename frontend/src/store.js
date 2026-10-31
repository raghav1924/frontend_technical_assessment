// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  isLocked: false,
  isDarkMode: false,
  isSidebarOpen: true,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  toggleLock: () => {
    set((state) => ({ isLocked: !state.isLocked }));
  },

  toggleTheme: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    if (get().isLocked) return;
    set({
      nodes: [...get().nodes, node],
    });
  },

  deleteNode: (nodeId) => {
    if (get().isLocked) return;
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  onNodesChange: (changes) => {
    if (get().isLocked) return;
    const nextNodes = applyNodeChanges(changes, get().nodes);
    // If any nodes were removed, clean up edges connected to them
    const removedNodeIds = new Set(
      changes.filter((c) => c.type === 'remove').map((c) => c.id)
    );
    if (removedNodeIds.size > 0) {
      set({
        nodes: nextNodes,
        edges: get().edges.filter(
          (edge) =>
            !removedNodeIds.has(edge.source) && !removedNodeIds.has(edge.target)
        ),
      });
    } else {
      set({
        nodes: nextNodes,
      });
    }
  },

  onEdgesChange: (changes) => {
    if (get().isLocked) return;
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    if (get().isLocked) return;
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: false,
          style: { stroke: get().isDarkMode ? '#8B949E' : '#7C7B76', strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: get().isDarkMode ? '#8B949E' : '#7C7B76',
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
