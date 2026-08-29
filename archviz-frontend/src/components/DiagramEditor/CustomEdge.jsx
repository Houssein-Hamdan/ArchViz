import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}) {
  const { setEdges } = useReactFlow();
  // calculate straight coordinates and middle point label positioning
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // active styling toggles when selected
  const edgeColor = selected ? '#3b82f6' : '#d1d5db';
  const strokeWidth = selected ? 3 : 2;

  return (
    <>
      <BaseEdge
        path={edgePath}
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        style={{
          stroke: edgeColor,
          strokeWidth,
          transition: 'all 0.2s ease',
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Label */}
          <div className="bg-white border-2 border-gray-300 rounded px-3 py-1 text-xs font-semibold text-gray-700 shadow-md">
            {data?.label}
          </div>

          {/* Description (Tooltip) */}
          {data?.description && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {data.description}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}