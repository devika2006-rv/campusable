export type VerificationStatus = 'verified' | 'unverified' | 'approximate' | 'demo';

export type BuildingCategory =
  | 'academic'
  | 'administrative'
  | 'library'
  | 'sports'
  | 'amenity'
  | 'hostel'
  | 'canteen'
  | 'auditorium'
  | 'lab'
  | 'utility'
  | 'outdoor'
  | 'bank_atm'
  | 'other';

export type FacilityCategory =
  | 'accessible_toilet'
  | 'lift'
  | 'ramp'
  | 'drinking_water'
  | 'first_aid'
  | 'wheelchair_parking'
  | 'helpdesk'
  | 'canteen'
  | 'lab'
  | 'office'
  | 'library'
  | 'other';

export type AccessibilityStatus =
  | 'fully_accessible'
  | 'partially_accessible'
  | 'not_accessible'
  | 'unknown';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions3D {
  width: number;
  height: number;
  depth: number;
}

export interface Entrance {
  id: string;
  name: string;
  isAccessible: boolean;
  hasRamp: boolean;
  hasStairs: boolean;
  doorWidthCm?: number;
  verificationStatus: VerificationStatus;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  isAccessible: boolean;
  notes?: string;
}

export interface Corridor {
  id: string;
  name: string;
  isStepFree: boolean;
}

export interface StairInfo {
  id: string;
  location: string;
  flightCount: number;
  hasHandrail: boolean;
}

export interface LiftInfo {
  id: string;
  location: string;
  servesFloors: number[];
  doorWidthCm?: number;
  hasAudioAnnouncements?: boolean;
  hasBrailleButtons?: boolean;
  operationalStatus: 'operational' | 'under_maintenance' | 'unknown';
  verificationStatus: VerificationStatus;
}

export interface RampInfo {
  id: string;
  location: string;
  slope: 'gentle' | 'moderate' | 'steep' | 'unknown';
  hasHandrails: boolean;
  verificationStatus: VerificationStatus;
}

export interface AccessibilityFeatureItem {
  id: string;
  type:
    | 'ramp'
    | 'lift'
    | 'step_free_entrance'
    | 'accessible_toilet'
    | 'braille_signage'
    | 'tactile_paving'
    | 'handrail'
    | 'reserved_parking'
    | 'wide_doorway';
  label: string;
  description: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  source?: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  displayName: string;
  rooms: Room[];
  corridors: Corridor[];
  stairs: StairInfo[];
  lifts: LiftInfo[];
  ramps: RampInfo[];
  accessibleEntrances: string[];
  floorPlanImage?: string;
  verificationStatus: VerificationStatus;
}

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  buildingId: string;
  floorId?: string;
  location?: string;
  accessibilityStatus: AccessibilityStatus;
  verificationStatus: VerificationStatus;
  notes?: string;
  source?: string;
}

export interface Building {
  id: string;
  name: string;
  code?: string;
  category: BuildingCategory;
  description: string;
  position: Vector3D;
  dimensions: Dimensions3D;
  rotation: Vector3D;
  color?: string;
  floors: Floor[];
  entrances: Entrance[];
  facilities: Facility[];
  accessibilityFeatures: AccessibilityFeatureItem[];
  verificationStatus: VerificationStatus;
  mapNumber?: number;
  confidenceLevel?: 'high' | 'medium' | 'low' | 'uncertain';
  mapSection?: 'north_side' | 'south_side' | 'central' | 'outdoor';
  auditReviewStatus?: 'pending_review' | 'approved' | 'modified' | 'rejected';
  source: string;
  lastVerifiedAt: string;
}

export interface RouteNode {
  id: string;
  name: string;
  coordinates: Vector3D;
  type: 'campus_entrance' | 'building_entrance' | 'junction' | 'path_point' | 'ramp' | 'lift' | 'stair';
  verificationStatus: VerificationStatus;
  buildingId?: string;
  floorId?: string;
}

export interface RouteEdge {
  id: string;
  source: string;
  target: string;
  distance: number;
  segmentType: 'paved_walkway' | 'road' | 'ramp' | 'stairs' | 'lift' | 'corridor' | 'unpaved';
  stairsPresent: boolean;
  stepFree: boolean;
  rampVerified: boolean;
  liftVerified: boolean;
  gradient?: 'flat' | 'gentle' | 'moderate' | 'steep';
  surfaceQuality?: 'smooth' | 'paved' | 'gravel' | 'rough';
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface RoutePreferences {
  avoidStairs: boolean;
  preferStepFree: boolean;
  preferRamps: boolean;
  preferLifts: boolean;
  avoidUnverified: boolean;
  minimizeDistance: boolean;
}

export interface RouteStep {
  stepIndex: number;
  fromNode: RouteNode;
  toNode: RouteNode;
  edge: RouteEdge;
  instruction: string;
  distance: number;
  stepFree: boolean;
  warning?: string;
}

export interface CalculatedRoute {
  found: boolean;
  nodes: RouteNode[];
  edges: RouteEdge[];
  steps: RouteStep[];
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  isCompletelyStepFree: boolean;
  containsStairs: boolean;
  containsUnverifiedSegments: boolean;
  warnings: string[];
  explanation: string;
}

export type IssueCategory =
  | 'broken_lift'
  | 'blocked_ramp'
  | 'steep_slope'
  | 'missing_handrail'
  | 'uneven_pavement'
  | 'inaccessible_entrance'
  | 'poor_signage'
  | 'lighting_issue'
  | 'other';

export interface IssueReport {
  id: string;
  category: IssueCategory;
  buildingId?: string;
  locationDescription: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  imageAttachmentName?: string;
  contactDetails?: string;
  createdAt: string;
  status: 'submitted_demo' | 'under_review' | 'resolved';
}

export interface MapImportData {
  id: string;
  title: string;
  imageDataUrl: string;
  fileName: string;
  fileSizeKb: number;
  sourceNotes: string;
  orientationNotes: string;
  knownLandmarks: string[];
  knownBuildingLabels: string[];
  uploadedAt: string;
}

export interface AICandidateBuilding {
  candidateId: string;
  suggestedName: string;
  confidenceScore: number; // 0 to 1
  approximateBounds: { x: number; y: number; width: number; height: number };
  detectedEntrancesCount: number;
  notes: string;
}

export interface AICandidatePath {
  candidateId: string;
  fromCandidateId: string;
  toCandidateId: string;
  estimatedType: 'paved_walkway' | 'road' | 'stairs';
  confidenceScore: number;
  hasVisibleStairs: boolean;
}

export interface AIInterpretationResult {
  importId: string;
  processedAt: string;
  overallConfidence: number;
  modelIdentifier: string;
  disclaimer: string;
  candidateBuildings: AICandidateBuilding[];
  candidatePaths: AICandidatePath[];
  recommendedHumanReviewItems: string[];
}

export interface CampusDataset {
  version: string;
  campusName: string;
  campusLocation: string;
  coordinates: { lat: number; lng: number };
  referenceUrls: {
    googleMaps: string;
    sitePlanPdf: string;
    campusTour: string;
  };
  lastUpdated: string;
  buildings: Building[];
  routeNodes: RouteNode[];
  routeEdges: RouteEdge[];
}
