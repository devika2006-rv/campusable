import React, { useState } from 'react';
import { getStoredCampusData } from '../utils/storage';
import { Facility, AccessibilityFeatureItem, Building } from '../types/campus';
import { VerificationBadge } from '../components/layout/VerificationBadge';
import { Link } from 'react-router-dom';
import {
  Accessibility,
  DoorOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Info,
  Filter,
} from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const dataset = getStoredCampusData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Collate all accessible amenities across campus buildings
  const allAccessibilityItems: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    buildingName: string;
    buildingId: string;
    floorInfo?: string;
    status: any;
    source: string;
    category: 'toilet' | 'ramp' | 'lift' | 'entrance' | 'feature' | 'other';
  }> = [];

  dataset.buildings.forEach((bldg) => {
    // Entrances
    bldg.entrances.forEach((ent) => {
      if (ent.isAccessible || ent.hasRamp) {
        allAccessibilityItems.push({
          id: ent.id,
          type: ent.hasRamp ? 'Accessible Ramp Entrance' : 'Level Step-Free Entrance',
          title: ent.name,
          description: `Clear door width: ${ent.doorWidthCm || '120+'}cm. Ramp: ${ent.hasRamp ? 'Yes' : 'No'}.`,
          buildingName: bldg.name,
          buildingId: bldg.id,
          status: ent.verificationStatus,
          source: bldg.source,
          category: 'entrance',
        });
      }
    });

    // Facilities
    bldg.facilities.forEach((fac) => {
      let cat: 'toilet' | 'ramp' | 'lift' | 'other' = 'other';
      if (fac.category === 'accessible_toilet') cat = 'toilet';
      if (fac.category === 'ramp') cat = 'ramp';
      if (fac.category === 'lift') cat = 'lift';

      allAccessibilityItems.push({
        id: fac.id,
        type: fac.category.replace('_', ' ').toUpperCase(),
        title: fac.name,
        description: fac.notes || fac.location || 'Accessible facility registered in building.',
        buildingName: bldg.name,
        buildingId: bldg.id,
        floorInfo: fac.floorId,
        status: fac.verificationStatus,
        source: fac.source || bldg.source,
        category: cat,
      });
    });

    // Accessibility features
    bldg.accessibilityFeatures.forEach((feat) => {
      allAccessibilityItems.push({
        id: feat.id,
        type: feat.label,
        title: feat.label,
        description: feat.description,
        buildingName: bldg.name,
        buildingId: bldg.id,
        status: feat.verificationStatus,
        source: feat.source || bldg.source,
        category: feat.type === 'ramp' ? 'ramp' : 'feature',
      });
    });
  });

  const filteredItems = allAccessibilityItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ramps') return item.category === 'ramp' || item.type.toLowerCase().includes('ramp');
    if (selectedFilter === 'lifts') return item.category === 'lift' || item.type.toLowerCase().includes('lift');
    if (selectedFilter === 'toilets') return item.category === 'toilet';
    if (selectedFilter === 'entrances') return item.category === 'entrance';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Accessibility className="w-8 h-8 text-teal-600" />
            <span>Accessibility Information Centre</span>
          </h1>
        </div>
        <p className="text-sm text-slate-600 max-w-2xl">
          Comprehensive inventory of audited wheelchair ramps, accessible restrooms, lifts, and step-free access across all campus blocks.
        </p>

        {/* Ground Truth Policy Callout */}
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Honesty Policy: </strong>
            We never assume a facility is accessible based solely on its architectural title. Every item lists its audit verification status and source documentation.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {[
          { key: 'all', label: 'All Accessible Features' },
          { key: 'ramps', label: 'Ramps & Slopes' },
          { key: 'lifts', label: 'Elevators & Lifts' },
          { key: 'toilets', label: 'Accessible Restrooms' },
          { key: 'entrances', label: 'Step-Free Entrances' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === tab.key
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {item.type}
                </span>
                <VerificationBadge status={item.status} size="sm" />
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>

              <div className="text-xs text-slate-500 mb-3">
                Located at <strong className="text-slate-800">{item.buildingName}</strong>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <Link
                to={`/building/${item.buildingId}`}
                className="text-purple-800 hover:text-purple-950 font-semibold"
              >
                View Building
              </Link>
              <Link
                to={`/navigate?to=${item.buildingId}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-2xs text-[11px]"
              >
                <Navigation className="w-3 h-3" />
                <span>Navigate Here</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
