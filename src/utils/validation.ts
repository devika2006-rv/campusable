import { CampusDataset, IssueReport } from '../types/campus';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validates a complete CampusDataset for relational and business rule integrity
 */
export function validateCampusDataset(data: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: [{ field: 'root', message: 'Dataset must be a valid JSON object.', severity: 'error' }],
      warnings: [],
    };
  }

  const ds = data as Partial<CampusDataset>;

  if (!ds.campusName || typeof ds.campusName !== 'string') {
    errors.push({ field: 'campusName', message: 'Campus name is required.', severity: 'error' });
  }

  if (!Array.isArray(ds.buildings)) {
    errors.push({ field: 'buildings', message: 'Buildings must be an array.', severity: 'error' });
  }

  if (!Array.isArray(ds.routeNodes)) {
    errors.push({ field: 'routeNodes', message: 'Route nodes must be an array.', severity: 'error' });
  }

  if (!Array.isArray(ds.routeEdges)) {
    errors.push({ field: 'routeEdges', message: 'Route edges must be an array.', severity: 'error' });
  }

  // Early return if structural root fields fail
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  const buildingIdSet = new Set<string>();
  const floorIdSet = new Set<string>();
  const nodeIdSet = new Set<string>();
  const edgeIdSet = new Set<string>();

  // Validate Buildings
  ds.buildings!.forEach((b, index) => {
    const bPrefix = `buildings[${index}]`;
    if (!b.id) {
      errors.push({ field: `${bPrefix}.id`, message: 'Building ID is required.', severity: 'error' });
    } else {
      if (buildingIdSet.has(b.id)) {
        errors.push({ field: `${bPrefix}.id`, message: `Duplicate building ID detected: "${b.id}"`, severity: 'error' });
      }
      buildingIdSet.add(b.id);
    }

    if (!b.name || b.name.trim().length === 0) {
      errors.push({ field: `${bPrefix}.name`, message: `Building "${b.id || index}" has no name.`, severity: 'error' });
    }

    if (!b.position || typeof b.position.x !== 'number' || typeof b.position.y !== 'number' || typeof b.position.z !== 'number') {
      errors.push({ field: `${bPrefix}.position`, message: `Building "${b.id}" position must have numeric x, y, z.`, severity: 'error' });
    }

    if (!b.dimensions || b.dimensions.width <= 0 || b.dimensions.height <= 0 || b.dimensions.depth <= 0) {
      errors.push({ field: `${bPrefix}.dimensions`, message: `Building "${b.id}" dimensions must be positive numbers.`, severity: 'error' });
    }

    // Validate Floors
    if (Array.isArray(b.floors)) {
      b.floors.forEach((fl, fIdx) => {
        const flPrefix = `${bPrefix}.floors[${fIdx}]`;
        if (!fl.id) {
          errors.push({ field: `${flPrefix}.id`, message: 'Floor ID is required.', severity: 'error' });
        } else {
          if (floorIdSet.has(fl.id)) {
            errors.push({ field: `${flPrefix}.id`, message: `Duplicate floor ID: "${fl.id}"`, severity: 'error' });
          }
          floorIdSet.add(fl.id);
        }

        if (fl.buildingId && fl.buildingId !== b.id) {
          errors.push({
            field: `${flPrefix}.buildingId`,
            message: `Floor "${fl.id}" buildingId "${fl.buildingId}" does not match parent "${b.id}".`,
            severity: 'error',
          });
        }
      });
    }

    // Validate Facilities
    if (Array.isArray(b.facilities)) {
      b.facilities.forEach((fac, facIdx) => {
        const facPrefix = `${bPrefix}.facilities[${facIdx}]`;
        if (fac.floorId && !floorIdSet.has(fac.floorId)) {
          warnings.push({
            field: `${facPrefix}.floorId`,
            message: `Facility "${fac.name || fac.id}" references unverified or missing floor ID "${fac.floorId}".`,
            severity: 'warning',
          });
        }
      });
    }
  });

  // Validate Route Nodes
  ds.routeNodes!.forEach((node, nIdx) => {
    const nodePrefix = `routeNodes[${nIdx}]`;
    if (!node.id) {
      errors.push({ field: `${nodePrefix}.id`, message: 'Route node ID is required.', severity: 'error' });
    } else {
      if (nodeIdSet.has(node.id)) {
        errors.push({ field: `${nodePrefix}.id`, message: `Duplicate route node ID: "${node.id}"`, severity: 'error' });
      }
      nodeIdSet.add(node.id);
    }

    if (node.buildingId && !buildingIdSet.has(node.buildingId)) {
      warnings.push({
        field: `${nodePrefix}.buildingId`,
        message: `Node "${node.id}" references nonexistent building ID "${node.buildingId}".`,
        severity: 'warning',
      });
    }
  });

  // Validate Route Edges
  ds.routeEdges!.forEach((edge, eIdx) => {
    const edgePrefix = `routeEdges[${eIdx}]`;
    if (!edge.id) {
      errors.push({ field: `${edgePrefix}.id`, message: 'Route edge ID is required.', severity: 'error' });
    } else {
      if (edgeIdSet.has(edge.id)) {
        errors.push({ field: `${edgePrefix}.id`, message: `Duplicate edge ID: "${edge.id}"`, severity: 'error' });
      }
      edgeIdSet.add(edge.id);
    }

    if (edge.distance < 0) {
      errors.push({
        field: `${edgePrefix}.distance`,
        message: `Negative distance (${edge.distance}m) found on edge "${edge.id}".`,
        severity: 'error',
      });
    }

    if (!nodeIdSet.has(edge.source)) {
      errors.push({
        field: `${edgePrefix}.source`,
        message: `Edge "${edge.id}" connects from unknown node ID "${edge.source}".`,
        severity: 'error',
      });
    }

    if (!nodeIdSet.has(edge.target)) {
      errors.push({
        field: `${edgePrefix}.target`,
        message: `Edge "${edge.id}" connects to unknown node ID "${edge.target}".`,
        severity: 'error',
      });
    }

    // Honest accessibility sanity check
    if (edge.stairsPresent && edge.stepFree) {
      errors.push({
        field: `${edgePrefix}`,
        message: `Inconsistent edge "${edge.id}": Cannot mark stepFree=true when stairsPresent=true.`,
        severity: 'error',
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates image upload formats
 */
export function validateImageFile(file: File): { isValid: boolean; message?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `Unsupported format "${file.type}". Please upload PNG, JPG, or WebP.`,
    };
  }

  // Max 15MB
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      message: `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 15MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates user-submitted issue reports
 */
export function validateIssueReport(data: Partial<IssueReport>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.category) {
    errors.category = 'Please select an accessibility issue category.';
  }

  if (!data.locationDescription || data.locationDescription.trim().length < 3) {
    errors.locationDescription = 'Please provide a clear location description (at least 3 characters).';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Please explain the barrier or issue in detail (at least 10 characters).';
  }

  if (data.contactDetails && data.contactDetails.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactDetails)) {
    errors.contactDetails = 'Please provide a valid email format if entering an email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
