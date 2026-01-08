import { FlowConfig, RedNoxNode } from "@/types/rednox";
import { Node, Edge } from "@xyflow/react";
export function toReactFlow(flow: FlowConfig) {
  const nodes: Node[] = flow.nodes.map((n) => ({
    id: n.id,
    type: "rednoxNode",
    position: { x: n.x || 0, y: n.y || 0 },
    data: {
      label: n.name || n.type,
      type: n.type,
      config: n
    },
  }));
  const edges: Edge[] = [];
  flow.nodes.forEach((node) => {
    if (node.wires) {
      node.wires.forEach((outputs, outputIndex) => {
        outputs.forEach((targetId) => {
          edges.push({
            id: `e-${node.id}-${targetId}-${outputIndex}`,
            source: node.id,
            target: targetId,
            sourceHandle: `out-${outputIndex}`,
            targetHandle: `in-0`,
          });
        });
      });
    }
  });
  return { nodes, edges };
}
export function fromReactFlow(
  id: string,
  label: string,
  nodes: Node[],
  edges: Edge[],
  existingFlow: Partial<FlowConfig> = {}
): FlowConfig {
  const rednoxNodes: RedNoxNode[] = nodes.map((node) => {
    const config = (node.data?.config as Partial<RedNoxNode>) || {};
    // Group edges by source handle index
    const wires: string[][] = [];
    const nodeEdges = edges.filter((e) => e.source === node.id);
    nodeEdges.forEach((edge) => {
      const handleId = edge.sourceHandle || "out-0";
      const index = parseInt(handleId.split("-")[1]) || 0;
      if (!wires[index]) wires[index] = [];
      wires[index].push(edge.target);
    });
    return {
      ...config,
      id: node.id,
      type: (node.data?.type as string) || "debug",
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
      z: id,
      wires: wires,
      name: (node.data?.label as string) || (config.name as string) || "",
    } as RedNoxNode;
  });
  return {
    id,
    label,
    enabled: existingFlow.enabled ?? false,
    description: existingFlow.description || "",
    nodes: rednoxNodes,
  };
}