import { Building, CampusDataset, Facility, IssueReport, MapImportData } from '../types/campus';
import { DEFAULT_CAMPUS_DATA } from '../data/defaultCampusData';

const STORAGE_KEYS = {
  CAMPUS_DATA: 'campusable_campus_dataset_v2',
  REPORTS: 'campusable_issue_reports_v1',
  MAP_IMPORTS: 'campusable_map_imports_v1',
  PREFERENCES: 'campusable_user_preferences_v1',
};

// ================= Campus Dataset Storage =================

export function getStoredCampusData(): CampusDataset {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPUS_DATA);
    if (!raw) {
      saveCampusData(DEFAULT_CAMPUS_DATA);
      return DEFAULT_CAMPUS_DATA;
    }
    const parsed = JSON.parse(raw) as CampusDataset;
    // Auto-update to v2 if version is older
    if (!parsed.buildings || !parsed.routeNodes || !parsed.routeEdges || parsed.version !== DEFAULT_CAMPUS_DATA.version) {
      saveCampusData(DEFAULT_CAMPUS_DATA);
      return DEFAULT_CAMPUS_DATA;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse campus data from LocalStorage:', error);
    return DEFAULT_CAMPUS_DATA;
  }
}

export function saveCampusData(data: CampusDataset): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPUS_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save campus data to LocalStorage:', error);
  }
}

export function resetCampusDataToDefault(): CampusDataset {
  saveCampusData(DEFAULT_CAMPUS_DATA);
  return DEFAULT_CAMPUS_DATA;
}

// ================= Building Operations =================

export function updateBuilding(updated: Building): CampusDataset {
  const dataset = getStoredCampusData();
  const index = dataset.buildings.findIndex((b) => b.id === updated.id);
  if (index >= 0) {
    dataset.buildings[index] = updated;
  } else {
    dataset.buildings.push(updated);
  }
  dataset.lastUpdated = new Date().toISOString().split('T')[0];
  saveCampusData(dataset);
  return dataset;
}

export function deleteBuilding(buildingId: string): CampusDataset {
  const dataset = getStoredCampusData();
  dataset.buildings = dataset.buildings.filter((b) => b.id !== buildingId);
  // Also remove orphaned facilities or route references if linked
  dataset.routeNodes = dataset.routeNodes.filter((n) => n.buildingId !== buildingId);
  dataset.lastUpdated = new Date().toISOString().split('T')[0];
  saveCampusData(dataset);
  return dataset;
}

export function updateFacility(facility: Facility): CampusDataset {
  const dataset = getStoredCampusData();
  const building = dataset.buildings.find((b) => b.id === facility.buildingId);
  if (building) {
    const facIndex = building.facilities.findIndex((f) => f.id === facility.id);
    if (facIndex >= 0) {
      building.facilities[facIndex] = facility;
    } else {
      building.facilities.push(facility);
    }
    updateBuilding(building);
  }
  return dataset;
}

// ================= Accessibility Issue Reports Storage =================

export function getStoredReports(): IssueReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    return JSON.parse(raw) as IssueReport[];
  } catch (error) {
    console.error('Failed to parse issue reports:', error);
    return [];
  }
}

export function saveReport(report: IssueReport): IssueReport[] {
  const existing = getStoredReports();
  const updated = [report, ...existing];
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save issue report:', error);
  }
  return updated;
}

export function deleteReport(reportId: string): IssueReport[] {
  const existing = getStoredReports();
  const updated = existing.filter((r) => r.id !== reportId);
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete report:', error);
  }
  return updated;
}

// ================= Map Imports Storage =================

export function getStoredMapImports(): MapImportData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MAP_IMPORTS);
    if (!raw) return [];
    return JSON.parse(raw) as MapImportData[];
  } catch (error) {
    console.error('Failed to read map imports:', error);
    return [];
  }
}

export function saveMapImport(mapData: MapImportData): MapImportData[] {
  const existing = getStoredMapImports();
  const updated = [mapData, ...existing.filter((m) => m.id !== mapData.id)];
  try {
    localStorage.setItem(STORAGE_KEYS.MAP_IMPORTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save map import:', error);
  }
  return updated;
}
