import React from 'react';
import { IssueReport } from '../../types/campus';
import { deleteReport } from '../../utils/storage';
import { AlertCircle, Trash2, Calendar, MapPin, Tag } from 'lucide-react';

interface Props {
  reports: IssueReport[];
  onReportsUpdated: (updated: IssueReport[]) => void;
}

export const ReportListView: React.FC<Props> = ({ reports, onReportsUpdated }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this demo issue report?')) {
      const updated = deleteReport(id);
      onReportsUpdated(updated);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-700">No issue reports logged yet</p>
        <p className="text-xs text-slate-500">
          Submitted reports will appear here for local review and testing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Previously Logged Reports ({reports.length})
        </h3>
        <span className="text-xs text-slate-500">Stored in LocalStorage</span>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm capitalize">
                    {report.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      report.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : report.severity === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.severity} severity
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.locationDescription}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(report.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete local report"
                aria-label={`Delete report ${report.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {report.description}
            </p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              {report.imageAttachmentName && (
                <span className="text-slate-600 font-mono">Attachment: {report.imageAttachmentName}</span>
              )}
              {report.contactDetails && (
                <span className="text-slate-600">Contact: {report.contactDetails}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
