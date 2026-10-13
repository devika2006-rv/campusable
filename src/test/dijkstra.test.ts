import { describe, it, expect } from 'vitest';
import { calculateAccessibleRoute } from '../utils/dijkstra';
import { RouteEdge, RouteNode, RoutePreferences } from '../types/campus';

describe('Dijkstra Accessible Pathfinding', () => {
  const sampleNodes: RouteNode[] = [
    {
      id: 'node-A',
      name: 'Main Gate',
      coordinates: { x: 0, y: 0, z: 0 },
      type: 'campus_entrance',
      verificationStatus: 'verified',
    },
    {
      id: 'node-B',
      name: 'Central Courtyard',
      coordinates: { x: 10, y: 0, z: 0 },
      type: 'junction',
      verificationStatus: 'verified',
    },
    {
      id: 'node-C',
      name: 'Library Front Porch',
      coordinates: { x: 20, y: 0, z: 0 },
      type: 'building_entrance',
      verificationStatus: 'verified',
    },
  ];

  it('calculates a direct step-free path when available', () => {
    const edges: RouteEdge[] = [
      {
        id: 'edge-AB',
        source: 'node-A',
        target: 'node-B',
        distance: 50,
        segmentType: 'paved_walkway',
        stairsPresent: false,
        stepFree: true,
        rampVerified: true,
        liftVerified: false,
        verificationStatus: 'verified',
      },
      {
        id: 'edge-BC',
        source: 'node-B',
        target: 'node-C',
        distance: 50,
        segmentType: 'paved_walkway',
        stairsPresent: false,
        stepFree: true,
        rampVerified: true,
        liftVerified: false,
        verificationStatus: 'verified',
      },
    ];

    const prefs: RoutePreferences = {
      avoidStairs: true,
      preferStepFree: true,
      preferRamps: true,
      preferLifts: false,
      avoidUnverified: false,
      minimizeDistance: false,
    };

    const route = calculateAccessibleRoute('node-A', 'node-C', sampleNodes, edges, prefs);

    expect(route.found).toBe(true);
    expect(route.totalDistanceMeters).toBe(100);
    expect(route.isCompletelyStepFree).toBe(true);
    expect(route.containsStairs).toBe(false);
    expect(route.steps.length).toBe(2);
  });

  it('strictly rejects stair flight edges when avoidStairs is true', () => {
    const edgesWithStairs: RouteEdge[] = [
      // Direct shortcut that has stairs
      {
        id: 'edge-AC-stairs',
        source: 'node-A',
        target: 'node-C',
        distance: 30, // Shorter distance!
        segmentType: 'stairs',
        stairsPresent: true,
        stepFree: false,
        rampVerified: false,
        liftVerified: false,
        verificationStatus: 'verified',
      },
      // Longer step-free alternative
      {
        id: 'edge-AB-level',
        source: 'node-A',
        target: 'node-B',
        distance: 40,
        segmentType: 'paved_walkway',
        stairsPresent: false,
        stepFree: true,
        rampVerified: true,
        liftVerified: false,
        verificationStatus: 'verified',
      },
      {
        id: 'edge-BC-level',
        source: 'node-B',
        target: 'node-C',
        distance: 40,
        segmentType: 'paved_walkway',
        stairsPresent: false,
        stepFree: true,
        rampVerified: true,
        liftVerified: false,
        verificationStatus: 'verified',
      },
    ];

    const prefs: RoutePreferences = {
      avoidStairs: true,
      preferStepFree: true,
      preferRamps: true,
      preferLifts: false,
      avoidUnverified: false,
      minimizeDistance: false,
    };

    const route = calculateAccessibleRoute('node-A', 'node-C', sampleNodes, edgesWithStairs, prefs);

    expect(route.found).toBe(true);
    expect(route.containsStairs).toBe(false);
    expect(route.isCompletelyStepFree).toBe(true);
    // Should choose the longer 80m step-free route instead of the 30m stair shortcut
    expect(route.totalDistanceMeters).toBe(80);
  });

  it('honestly returns found: false when only stairs connect the destination and avoidStairs is true', () => {
    const onlyStairsEdges: RouteEdge[] = [
      {
        id: 'edge-AB-stairs',
        source: 'node-A',
        target: 'node-B',
        distance: 30,
        segmentType: 'stairs',
        stairsPresent: true,
        stepFree: false,
        rampVerified: false,
        liftVerified: false,
        verificationStatus: 'verified',
      },
    ];

    const prefs: RoutePreferences = {
      avoidStairs: true,
      preferStepFree: true,
      preferRamps: false,
      preferLifts: false,
      avoidUnverified: false,
      minimizeDistance: false,
    };

    const route = calculateAccessibleRoute('node-A', 'node-B', sampleNodes, onlyStairsEdges, prefs);

    expect(route.found).toBe(false);
    expect(route.isCompletelyStepFree).toBe(false);
    expect(route.explanation).toContain('No step-free route found');
  });
});
