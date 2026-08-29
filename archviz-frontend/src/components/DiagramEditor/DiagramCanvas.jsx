import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import NodeDetailPanel from './NodeDetailPanel';
import EdgeDetailPanel from './EdgeDetailPanel';
import { ZoomIn, ZoomOut, Home, Save } from 'lucide-react';

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

  // Initialize nodes and edges from diagramData
  useState(() => {
    if (diagramData?.nodes && diagramData?.edges) {
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

      const initialEdges = diagramData.edges.map((edge) => ({
        id: edge.source + '-' + edge.target,
        source: edge.source,
        target: edge.target,
        data: {
          label: edge.label,
          description: edge.description,
          sourceLabel: diagramData.nodes.find(n => n.id === edge.source)?.label,
          targetLabel: diagramData.nodes.find(n => n.id === edge.target)?.label,
        },
        type: 'custom',
      }));

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((e, node) => {
    e.stopPropagation();
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  // Handle edge click
  const handleEdgeClick = useCallback((e, edge) => {
    e.stopPropagation();
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // Handle canvas click
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Handle new connection
  const onConnect = useCallback((connection) => {
    const edge = {
      ...connection,
      data: {
        label: 'HTTP',
        description: 'New connection',
      },
      type: 'custom',
    };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  // Delete node
  const handleDeleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  // Delete edge
  const handleDeleteEdge = useCallback(() => {
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setSelectedEdge(null);
  }, [selectedEdge, setEdges]);

  // Save changes
  const handleSave = useCallback(() => {
    const updatedDiagram = {
      nodes: nodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.data.type,
        technology: node.data.technology,
        role: node.role,
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
    <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900">
      {/* React Flow Canvas */}
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
        className="dark:bg-gray-900"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 z-10">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm md:text-base">
            {nodes.length} Components • {edges.length} Connections
          </h3>
        </div>

        <button
          onClick={handleSave}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition font-medium text-sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden md:inline">Save Changes</span>
          <span className="md:hidden">Save</span>
        </button>
      </div>

      {/* Details Panels */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onDelete={handleDeleteNode}
        />
      )}

      {selectedEdge && (
        <EdgeDetailPanel
          edge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onDelete={handleDeleteEdge}
        />
      )}

      {/* Instructions */}
      {!selectedNode && !selectedEdge && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-600 max-w-xs">
          <p className="font-medium mb-2">💡 How to use:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click a box to see details</li>
            <li>• Drag boxes to move them</li>
            <li>• Scroll to zoom</li>
            <li>• Click a line to see connection info</li>
          </ul>
        </div>
      )}
    </div>
  );
}