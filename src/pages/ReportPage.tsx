import React, { useState } from 'react';
import { getStoredCampusData, getStoredReports } from '../utils/storage';
import { IssueReportForm } from '../components/forms/IssueReportForm';
import { ReportListView } from '../features/reports/ReportListView';
import { IssueReport } from '../types/campus';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const dataset = getStoredCampusData();
  const [reports, setReports] = useState<IssueReport[]>(getStoredReports());

  const handleReportSubmitted = (newReport: IssueReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-rose-600" />
          <span>Report an Accessibility Barrier</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Help map obstacles, broken elevators, or unverified ramps across the campus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <IssueReportForm
            buildings={dataset.buildings}
            onReportSubmitted={handleReportSubmitted}
          />
        </div>

        {/* Previous Reports Column */}
        <div className="lg:col-span-5">
          <ReportListView reports={reports} onReportsUpdated={setReports} />
        </div>
      </div>
    </div>
  );
};
