/**
 * Hook: useEmployeeNodes
 * Fetches employee 3D node data and provides derived layout state.
 * Falls back to mock positions if API returns null coordinates.
 */
import { useEffect, useMemo, useState } from 'react';
import { getEmployeeNodes } from '../api/client';
import type { EmployeeNode } from '../types';

// Deterministic pseudo-random position from a seed string
function seededPosition(id: string, scale = 10): [number, number, number] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const x = (((hash & 0xff) / 255) * 2 - 1) * scale;
  const y = ((((hash >> 8) & 0xff) / 255) * 2 - 1) * scale;
  const z = ((((hash >> 16) & 0xff) / 255) * 2 - 1) * scale;
  return [x, y, z];
}

export interface PositionedNode extends EmployeeNode {
  x: number;
  y: number;
  z: number;
}

interface UseEmployeeNodesReturn {
  nodes: PositionedNode[];
  departments: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployeeNodes(): UseEmployeeNodesReturn {
  const [nodes, setNodes] = useState<EmployeeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getEmployeeNodes();
      setNodes(result.nodes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load employee data.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const positionedNodes = useMemo<PositionedNode[]>(() =>
    nodes.map((node) => {
      const [fx, fy, fz] = seededPosition(node.id, 12);
      return {
        ...node,
        x: node.pos_x ?? fx,
        y: node.pos_y ?? fy,
        z: node.pos_z ?? fz,
      };
    }),
    [nodes]
  );

  const departments = useMemo<string[]>(() => {
    const deptSet = new Set<string>();
    nodes.forEach((n) => { if (n.department) deptSet.add(n.department); });
    return Array.from(deptSet).sort();
  }, [nodes]);

  return { nodes: positionedNodes, departments, isLoading, error, refetch: fetchNodes };
}
