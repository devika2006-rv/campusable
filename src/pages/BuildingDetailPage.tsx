import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoredCampusData } from '../utils/storage';
import { BuildingDetailView } from '../features/buildings/BuildingDetailView';
import { Building2, ArrowLeft } from 'lucide-react';

export const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dataset = getStoredCampusData();

  const building = dataset.buildings.find((b) => b.id === id);

  if (!building) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Building Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested campus building ID "{id}" could not be located in the current database.
        </p>
        <div className="pt-4">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Building Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BuildingDetailView building={building} />
    </div>
  );
};
