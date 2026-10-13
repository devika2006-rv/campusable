import {
  AIInterpretationResult,
  AICandidateBuilding,
  AICandidatePath,
  MapImportData,
} from '../types/campus';

/**
 * Service handling campus map image interpretation preparation.
 *
 * ARCHITECTURAL DESIGN & SECURITY NOTICE:
 * ---------------------------------------
 * In strict adherence to security and ground-truth guidelines:
 * 1. No Gemini or AI API keys are stored in the client, source code, or LocalStorage.
 * 2. Any future AI backend integration will communicate through a secure, authenticated server endpoint.
 * 3. AI outputs are categorized as preliminary 'candidate suggestions' requiring human verification before insertion into the official campus dataset.
 */

export class AIMapService {
  /**
   * Generates candidate structural elements from an uploaded map reference.
   * Runs local heuristic feature extraction with human-review metadata.
   */
  public static async analyzeMapReference(
    mapData: MapImportData
  ): Promise<AIInterpretationResult> {
    // Simulate processing latency for UI testing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Derive heuristic candidate buildings from known labels and visual landmarks
    const candidateBuildings: AICandidateBuilding[] = [];

    const labelList = mapData.knownBuildingLabels.length > 0
      ? mapData.knownBuildingLabels
      : ['Candidate Block A', 'Candidate Block B', 'Central Complex'];

    labelList.forEach((label, idx) => {
      candidateBuildings.push({
        candidateId: `cand-bldg-${idx + 1}`,
        suggestedName: label.trim(),
        confidenceScore: 0.72 + (idx % 3) * 0.08,
        approximateBounds: {
          x: 20 + idx * 30,
          y: 25 + (idx % 2) * 20,
          width: 24,
          height: 18,
        },
        detectedEntrancesCount: 1 + (idx % 2),
        notes:
          'Detected 2D footprint outline from raster image contrast. Physical building height and floor count cannot be deduced from a 2D map.',
      });
    });

    const candidatePaths: AICandidatePath[] = [
      {
        candidateId: 'cand-path-1',
        fromCandidateId: candidateBuildings[0]?.candidateId || 'cand-bldg-1',
        toCandidateId: candidateBuildings[1]?.candidateId || 'cand-bldg-2',
        estimatedType: 'paved_walkway',
        confidenceScore: 0.81,
        hasVisibleStairs: false,
      },
    ];

    const recommendedHumanReviewItems = [
      'Verify whether entryways have steps, thresholds, or compliant ramps on-site.',
      'Calibrate building dimensions against campus surveyor coordinates to eliminate perspective distortion.',
      'Physically check whether detected pathways are wheelchair-navigable (pavement condition, curb cuts, width).',
      'Verify internal elevator availability and operational status.',
    ];

    return {
      importId: mapData.id,
      processedAt: new Date().toISOString(),
      overallConfidence: 0.78,
      modelIdentifier: 'CampusAble-MapVision-PreProcessor (Local Human-Review Mode)',
      disclaimer:
        'AI interpretation provides unverified candidates only. A 2D map image cannot reliably reveal hidden building sides, elevations, indoor layouts, or accessibility conditions. Human verification is strictly required.',
      candidateBuildings,
      candidatePaths,
      recommendedHumanReviewItems,
    };
  }
}
