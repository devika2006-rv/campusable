import { describe, it, expect } from 'vitest';
import {
  validateCampusDataset,
  validateImageFile,
  validateIssueReport,
} from '../utils/validation';
import { DEFAULT_CAMPUS_DATA } from '../data/defaultCampusData';

describe('Validation Utilities', () => {
  it('validates default campus dataset without errors', () => {
    const res = validateCampusDataset(DEFAULT_CAMPUS_DATA);
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  it('detects duplicate building IDs', () => {
    const invalidData = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    invalidData.buildings.push({
      ...invalidData.buildings[0],
    });

    const res = validateCampusDataset(invalidData);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('Duplicate building ID'))).toBe(true);
  });

  it('detects negative distances in route edges', () => {
    const invalidData = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    invalidData.routeEdges[0].distance = -15;

    const res = validateCampusDataset(invalidData);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('Negative distance'))).toBe(true);
  });

  it('detects inconsistent stepFree=true with stairsPresent=true', () => {
    const invalidData = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    invalidData.routeEdges[0].stairsPresent = true;
    invalidData.routeEdges[0].stepFree = true;

    const res = validateCampusDataset(invalidData);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('Cannot mark stepFree=true when stairsPresent=true'))).toBe(true);
  });

  it('validates image file formats correctly', () => {
    const pngFile = new File(['mock content'], 'test.png', { type: 'image/png' });
    const jpgFile = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' });
    const webpFile = new File(['mock content'], 'test.webp', { type: 'image/webp' });
    const pdfFile = new File(['mock content'], 'test.pdf', { type: 'application/pdf' });

    expect(validateImageFile(pngFile).isValid).toBe(true);
    expect(validateImageFile(jpgFile).isValid).toBe(true);
    expect(validateImageFile(webpFile).isValid).toBe(true);
    expect(validateImageFile(pdfFile).isValid).toBe(false);
    expect(validateImageFile(pdfFile).message).toContain('Unsupported format');
  });

  it('validates issue report fields and rejects empty forms', () => {
    const emptyReport = validateIssueReport({});
    expect(emptyReport.isValid).toBe(false);
    expect(emptyReport.errors.category).toBeDefined();
    expect(emptyReport.errors.locationDescription).toBeDefined();
    expect(emptyReport.errors.description).toBeDefined();

    const validReport = validateIssueReport({
      category: 'broken_lift',
      locationDescription: 'Administrative Block East Elevator',
      description: 'Out of order sign posted; buttons non-responsive on ground floor.',
    });
    expect(validReport.isValid).toBe(true);
  });
});
