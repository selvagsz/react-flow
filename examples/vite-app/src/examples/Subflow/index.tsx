import React, { useState, MouseEvent, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Node,
  Edge,
  ReactFlowInstance,
  Connection,
  MarkerType,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from 'reactflow';

import DebugNode from './DebugNode';

const onNodeDrag = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 100, y: 200 },
    className: 'light',
    style: {
      backgroundColor: 'rgba(255,50, 50, 0.5)',
      width: 500,
      height: 300,
    },
  },
  {
    id: '4a',
    data: { label: 'Node 4a' },
    position: { x: 15, y: 15 },
    className: 'light',
    parentNode: '4',
    extent: [
      [0, 0],
      [100, 100],
    ],
  },
  {
    id: '4b',
    data: { label: 'Node 4b' },
    position: { x: 100, y: 60 },
    className: 'light',
    style: {
      backgroundColor: 'rgba(50, 50, 255, 0.5)',
      height: 200,
      width: 300,
    },
    parentNode: '4',
  },
  {
    id: '4b1',
    data: { label: 'Node 4b1' },
    position: { x: 40, y: 20 },
    className: 'light',
    parentNode: '4b',
  },
  {
    id: '4b2',
    data: { label: 'Node 4b2' },
    position: { x: 20, y: 100 },
    className: 'light',
    parentNode: '4b',
  },
  {
    id: '5',
    type: 'group',
    data: { label: 'Node 5' },
    position: { x: 650, y: 250 },
    className: 'light',
    style: { width: 400, height: 150 },
    zIndex: 1000,
  },
  {
    id: '5a',
    data: { label: 'Node 5a' },
    position: { x: 0, y: 0 },
    className: 'light',
    parentNode: '5',
    extent: 'parent',
  },
  {
    id: '5b',
    data: { label: 'Node 5b' },
    position: { x: 225, y: 50 },
    className: 'light',
    parentNode: '5',
    expandParent: true,
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: {
      type: MarkerType.Arrow,
      strokeWidth: 2,
      width: 15,
      height: 15,
      color: '#f00',
    },
  },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4', zIndex: 100 },
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2', zIndex: 100 },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];

const nodeTypes = {
  default: DebugNode,
};

const Subflow = () => {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => setRfInstance(reactFlowInstance), []);

  const updatePos = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        if (!n.parentNode) {
          n.position = {
            x: Math.random() * 400,
            y: Math.random() * 400,
          };
        }

        return n;
      });
    });
  };

  const logToObject = () => console.log(rfInstance?.toObject());
  const resetTransform = () => rfInstance?.setViewport({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        n.className = n.className === 'light' ? 'dark' : 'light';
        return n;
      });
    });
  };

  const toggleChildNodes = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        n.hidden = !!n.parentNode && !n.hidden;
        return n;
      });
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      className="react-flow-basic-example"
      defaultViewport={defaultViewport}
      minZoom={0.2}
      maxZoom={4}
      onlyRenderVisibleElements={false}
      nodeTypes={nodeTypes}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />

      <Panel position="top-right">
        <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={toggleClassnames} style={{ marginRight: 5 }}>
          toggle classnames
        </button>
        <button style={{ marginRight: 5 }} onClick={toggleChildNodes}>
          toggleChildNodes
        </button>
        <button onClick={logToObject}>toObject</button>
      </Panel>
    </ReactFlow>
  );
};

export default Subflow;
