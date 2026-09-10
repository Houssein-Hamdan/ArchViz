
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
} from '@xyflow/react';

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeColor = selected
    ? 'var(--archviz-edge-selected)'
    : 'var(--archviz-edge-color)';

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
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <div
              className="
                bg-white
                dark:bg-gray-800

                border-2
                border-gray-300
                dark:border-gray-600

                rounded

                px-2
                sm:px-3
                py-1

                text-xs
                font-semibold

                text-gray-700
                dark:text-gray-200

                shadow-md

                whitespace-nowrap
              "
            >
              {data.label}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
