import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import NodeDetailPanel from './NodeDetailPanel';
import EdgeDetailPanel from './EdgeDetailPanel';

import { Save } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};
export default function DiagramCanvas({ diagramData, onSaveChanges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  useEffect(() => {
    if (!diagramData?.nodes || !diagramData?.edges) return;

    const initialNodes = diagramData.nodes.map((node, idx) => ({
      id: node.id,
      data: {
        label: node.label,
        type: node.type,
        technology: node.technology,
        role: node.role,
        why: node.why,
      },
      position: node.position || { x: idx * 300, y: 0 },
      type: 'custom',
    }));

    const initialEdges = diagramData.edges.map((edge, idx) => ({
      id: edge.id || `${edge.source}-${edge.target}-${idx}`,
      source: edge.source,
      target: edge.target,
      data: {
        label: edge.label,
        description: edge.description,
        sourceLabel: diagramData.nodes.find(
          (node) => node.id === edge.source
        )?.label,
        targetLabel: diagramData.nodes.find(
          (node) => node.id === edge.target
        )?.label,
      },
      type: 'custom',
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [diagramData, setNodes, setEdges]);

  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const handleEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        data: { label: 'HTTP', description: 'New connection' },
        type: 'custom',
      };
      setEdges((currentEdges) => addEdge(edge, currentEdges));
    },
    [setEdges]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== selectedNode.id)
    );
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== selectedNode.id &&
          edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdge) return;
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.id !== selectedEdge.id)
    );
    setSelectedEdge(null);
  }, [selectedEdge, setEdges]);

  const handleSave = useCallback(() => {
    const updatedDiagram = {
      nodes: nodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.data.type,
        technology: node.data.technology,
        role: node.data.role,
        why: node.data.why,
        position: node.position,
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        label: edge.data?.label,
        description: edge.data?.description,
      })),
    };
    onSaveChanges(updatedDiagram);
  }, [nodes, edges, onSaveChanges]);

  return (
    <div className="relative w-full h-full min-h-0 bg-gray-50 dark:bg-gray-900 flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
        padding: 0.1,
        minZoom: 0.35,
        maxZoom: 1.5,
        }}
        minZoom={0.35}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        className="dark:bg-gray-900"
        style={{ width: '100%', height: '100%' }}
      >
        <Background gap={16} size={1} />
        <div className="hidden md:block">
          <Controls position="top-right" />
        </div>
        <div className="hidden md:block">
        <MiniMap
            position="bottom-right"
            pannable
            zoomable
        />
        </div>
      </ReactFlow>

      {/* Top toolbar */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 z-10">
        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-xs sm:text-sm">
          {nodes.length} Components • {edges.length} Connections
        </h3>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition font-medium text-xs sm:text-sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>

      {/* Node details */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onDelete={handleDeleteNode}
        />
      )}

      {/* Edge details */}
      {selectedEdge && (
        <EdgeDetailPanel
          edge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onDelete={handleDeleteEdge}
        />
      )}

      {/* Instructions */}
      {!selectedNode && !selectedEdge && (
    <div className="hidden md:block absolute bottom-3 left-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-xs text-gray-600 dark:text-gray-300 max-w-xs z-10">          <p className="font-medium mb-1">How to use:</p>
          <p className="text-[11px] sm:text-xs leading-relaxed">
            Tap component for details • Drag to move • Pinch/scroll to zoom
          </p>
        </div>
      )}
    </div>
  );
}