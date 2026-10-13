import {
  CalculatedRoute,
  RouteEdge,
  RouteNode,
  RoutePreferences,
  RouteStep,
} from '../types/campus';

/**
 * Walking speed assumptions (clearly documented):
 * - Standard pedestrian walking pace: 75 m/min (~4.5 km/h)
 * - Accessible / mobility device pace: 50 m/min (~3.0 km/h)
 */
export const SPEED_ASSUMPTIONS = {
  standardWalkingMetersPerMin: 75,
  accessibleMetersPerMin: 50,
};

interface GraphEdge {
  targetNodeId: string;
  originalEdge: RouteEdge;
  effectiveWeight: number;
}

/**
 * Builds an adjacency list from undirected or bidirectional campus edges,
 * applying accessibility filters and cost penalties.
 */
function buildAdjacencyList(
  edges: RouteEdge[],
  preferences: RoutePreferences
): Map<string, GraphEdge[]> {
  const adj = new Map<string, GraphEdge[]>();

  for (const edge of edges) {
    // 1. Strict Filter: Avoid stairs
    if (preferences.avoidStairs) {
      if (edge.stairsPresent || !edge.stepFree) {
        continue; // Strictly skip stair edges
      }
    }

    // 2. Strict Filter: Avoid unverified segments if requested
    if (preferences.avoidUnverified) {
      if (edge.verificationStatus === 'unverified') {
        continue;
      }
    }

    // Calculate effective weight
    let weight = edge.distance;

    if (!preferences.minimizeDistance) {
      // Apply accessibility incentives and penalties
      if (preferences.preferStepFree && !edge.stepFree) {
        weight += 500; // Heavy penalty for non-step-free
      }
      if (preferences.preferRamps && edge.rampVerified) {
        weight = Math.max(1, weight * 0.7); // 30% preference bonus
      }
      if (preferences.preferLifts && edge.liftVerified) {
        weight = Math.max(1, weight * 0.8); // 20% preference bonus
      }
    }

    // Bidirectional campus paths
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)!.push({
      targetNodeId: edge.target,
      originalEdge: edge,
      effectiveWeight: weight,
    });

    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.target)!.push({
      targetNodeId: edge.source,
      originalEdge: edge,
      effectiveWeight: weight,
    });
  }

  return adj;
}

/**
 * Dijkstra shortest path implementation with accessibility rule enforcement
 */
export function calculateAccessibleRoute(
  startNodeId: string,
  endNodeId: string,
  nodes: RouteNode[],
  edges: RouteEdge[],
  preferences: RoutePreferences
): CalculatedRoute {
  const nodeMap = new Map<string, RouteNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const startNode = nodeMap.get(startNodeId);
  const endNode = nodeMap.get(endNodeId);

  if (!startNode || !endNode) {
    return {
      found: false,
      nodes: [],
      edges: [],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      isCompletelyStepFree: false,
      containsStairs: false,
      containsUnverifiedSegments: false,
      warnings: ['Invalid start or destination location.'],
      explanation: 'The requested origin or destination point could not be located on the campus map graph.',
    };
  }

  if (startNodeId === endNodeId) {
    return {
      found: true,
      nodes: [startNode],
      edges: [],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      isCompletelyStepFree: true,
      containsStairs: false,
      containsUnverifiedSegments: false,
      warnings: [],
      explanation: 'You are already at the selected destination.',
    };
  }

  const adj = buildAdjacencyList(edges, preferences);

  // Dijkstra distances and previous pointers
  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; edge: RouteEdge }>();
  const unvisited = new Set<string>();

  for (const node of nodes) {
    distances.set(node.id, Infinity);
    unvisited.add(node.id);
  }
  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const id of unvisited) {
      const d = distances.get(id)!;
      if (d < minDistance) {
        minDistance = d;
        currentId = id;
      }
    }

    if (!currentId || minDistance === Infinity) {
      break; // No remaining reachable nodes
    }

    if (currentId === endNodeId) {
      break; // Reached destination
    }

    unvisited.delete(currentId);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetNodeId)) continue;

      const alt = minDistance + neighbor.effectiveWeight;
      if (alt < distances.get(neighbor.targetNodeId)!) {
        distances.set(neighbor.targetNodeId, alt);
        previous.set(neighbor.targetNodeId, {
          nodeId: currentId,
          edge: neighbor.originalEdge,
        });
      }
    }
  }

  // Reconstruct path
  if (!previous.has(endNodeId)) {
    let explanation = `No connecting pathway exists between "${startNode.name}" and "${endNode.name}" under current settings.`;
    if (preferences.avoidStairs) {
      explanation = `No step-free route found between "${startNode.name}" and "${endNode.name}". All connecting pathways include stairs or lack verified ramps. Please check with campus reception or choose an alternative destination.`;
    }
    return {
      found: false,
      nodes: [],
      edges: [],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      isCompletelyStepFree: false,
      containsStairs: false,
      containsUnverifiedSegments: false,
      warnings: ['No route satisfies your selected accessibility criteria.'],
      explanation,
    };
  }

  const pathNodes: RouteNode[] = [];
  const pathEdges: RouteEdge[] = [];
  let curr = endNodeId;

  while (curr !== startNodeId) {
    const prevInfo = previous.get(curr)!;
    const nodeObj = nodeMap.get(curr)!;
    pathNodes.unshift(nodeObj);
    pathEdges.unshift(prevInfo.edge);
    curr = prevInfo.nodeId;
  }
  pathNodes.unshift(startNode);

  // Analyze route properties
  let totalDistanceMeters = 0;
  let containsStairs = false;
  let containsUnverifiedSegments = false;
  let isCompletelyStepFree = true;
  const warnings: string[] = [];

  const steps: RouteStep[] = [];

  for (let i = 0; i < pathEdges.length; i++) {
    const edge = pathEdges[i];
    const fromNode = pathNodes[i];
    const toNode = pathNodes[i + 1];
    totalDistanceMeters += edge.distance;

    if (edge.stairsPresent) {
      containsStairs = true;
      isCompletelyStepFree = false;
    }

    if (!edge.stepFree) {
      isCompletelyStepFree = false;
    }

    if (edge.verificationStatus === 'unverified' || edge.verificationStatus === 'demo') {
      containsUnverifiedSegments = true;
    }

    let instruction = `Follow ${formatSegmentType(edge.segmentType)} towards ${toNode.name} (${edge.distance}m)`;
    let stepWarning: string | undefined;

    if (edge.stairsPresent) {
      instruction = `Take stairs up/down towards ${toNode.name} (${edge.distance}m)`;
      stepWarning = 'Warning: This segment has stairs and is not step-free.';
    } else if (edge.rampVerified) {
      instruction = `Proceed via accessible ramp towards ${toNode.name} (${edge.distance}m)`;
    }

    steps.push({
      stepIndex: i + 1,
      fromNode,
      toNode,
      edge,
      instruction,
      distance: edge.distance,
      stepFree: edge.stepFree,
      warning: stepWarning,
    });
  }

  if (containsStairs) {
    warnings.push('This route includes stairs and is NOT wheelchair accessible.');
  }
  if (containsUnverifiedSegments) {
    warnings.push('Portions of this route use approximate or unverified campus data. Exercise caution.');
  }

  // Calculate speed
  const pace = isCompletelyStepFree
    ? SPEED_ASSUMPTIONS.accessibleMetersPerMin
    : SPEED_ASSUMPTIONS.standardWalkingMetersPerMin;
  const estimatedWalkingMinutes = Math.max(1, Math.round(totalDistanceMeters / pace));

  const explanation = isCompletelyStepFree
    ? `Step-free route confirmed (${totalDistanceMeters}m, ~${estimatedWalkingMinutes} min). Avoids all stairs.`
    : `Standard walking route (${totalDistanceMeters}m, ~${estimatedWalkingMinutes} min). Caution: contains stairs.`;

  return {
    found: true,
    nodes: pathNodes,
    edges: pathEdges,
    steps,
    totalDistanceMeters,
    estimatedWalkingMinutes,
    isCompletelyStepFree,
    containsStairs,
    containsUnverifiedSegments,
    warnings,
    explanation,
  };
}

function formatSegmentType(type: string): string {
  switch (type) {
    case 'paved_walkway':
      return 'paved pedestrian walkway';
    case 'road':
      return 'paved campus road';
    case 'ramp':
      return 'accessible concrete ramp';
    case 'stairs':
      return 'stair flight';
    case 'corridor':
      return 'indoor corridor';
    default:
      return 'pathway';
  }
}
