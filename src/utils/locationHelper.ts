import { Building, RouteNode } from '../types/campus';

export interface NavigableLocation {
  id: string; // Unique identifier for selector (e.g. "bldg-1-main-engineering" or "node-main-gate-road")
  name: string;
  category: string;
  mapNumber?: number;
  nodeId: string; // The corresponding route node ID used for graph calculation
  isBuilding: boolean;
  buildingId?: string;
}

/**
 * Builds a clean, unified, user-friendly list of navigable campus locations
 * by resolving buildings to their associated or nearest route nodes.
 */
export function getNavigableLocations(
  buildings: Building[],
  routeNodes: RouteNode[]
): NavigableLocation[] {
  const locations: NavigableLocation[] = [];

  // 1. Add major standalone entrance/access gates and key hubs first
  const standaloneNodes = routeNodes.filter((n) => !n.buildingId);
  for (const node of standaloneNodes) {
    let cleanName = node.name;
    if (node.id === 'node-main-gate-road') {
      cleanName = 'Main Campus Entrance Gate';
    } else if (node.id === 'node-west-sports-hub') {
      cleanName = 'Western Sports Concourse';
    } else if (node.id === 'node-workshops-hub') {
      cleanName = 'Central Workshop Junction';
    }

    locations.push({
      id: node.id,
      name: cleanName,
      category: node.type.replace('_', ' '),
      nodeId: node.id,
      isBuilding: false,
    });
  }

  // 2. Add all 26 campus landmarks and buildings, mapped to their node
  for (const bldg of buildings) {
    // Find directly linked route node by buildingId
    let targetNode = routeNodes.find((n) => n.buildingId === bldg.id);

    // If no direct link, find nearest node by Euclidean distance
    if (!targetNode && routeNodes.length > 0) {
      let minDist = Infinity;
      let nearest = routeNodes[0];
      for (const node of routeNodes) {
        const dx = node.coordinates.x - bldg.position.x;
        const dz = node.coordinates.z - bldg.position.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < minDist) {
          minDist = d;
          nearest = node;
        }
      }
      targetNode = nearest;
    }

    locations.push({
      id: bldg.id,
      name: bldg.name,
      category: bldg.category.replace('_', ' '),
      mapNumber: bldg.mapNumber,
      nodeId: targetNode ? targetNode.id : routeNodes[0]?.id || '',
      isBuilding: true,
      buildingId: bldg.id,
    });
  }

  // Sort: Main Gate first, then buildings ordered by mapNumber, then other junctions
  return locations.sort((a, b) => {
    if (a.id === 'node-main-gate-road') return -1;
    if (b.id === 'node-main-gate-road') return 1;
    if (a.mapNumber !== undefined && b.mapNumber !== undefined) {
      return a.mapNumber - b.mapNumber;
    }
    if (a.mapNumber !== undefined) return -1;
    if (b.mapNumber !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Resolves a location identifier (either a buildingId or nodeId) to a RouteNode ID.
 */
export function resolveToNodeId(
  locationId: string,
  locations: NavigableLocation[]
): string {
  const match = locations.find((l) => l.id === locationId || l.nodeId === locationId);
  return match ? match.nodeId : locationId;
}

/**
 * Resolves a route node ID or building ID to its human-readable display name.
 */
export function getLocationDisplayName(
  id: string,
  locations: NavigableLocation[]
): string {
  const match = locations.find((l) => l.id === id || l.nodeId === id || l.buildingId === id);
  return match ? match.name : id;
}
