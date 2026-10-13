import React, { useState } from 'react';
import { Building, IssueCategory, IssueReport } from '../../types/campus';
import { validateIssueReport } from '../../utils/validation';
import { saveReport } from '../../utils/storage';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  ShieldAlert,
  Send,
  X,
} from 'lucide-react';

interface Props {
  buildings: Building[];
  onReportSubmitted: (report: IssueReport) => void;
}

export const IssueReportForm: React.FC<Props> = ({ buildings, onReportSubmitted }) => {
  const [category, setCategory] = useState<IssueCategory>('blocked_ramp');
  const [buildingId, setBuildingId] = useState<string>('');
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [contactDetails, setContactDetails] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reportData: Partial<IssueReport> = {
      category,
      buildingId: buildingId || undefined,
      locationDescription,
      description,
      severity,
      contactDetails: contactDetails.trim() || undefined,
    };

    const validation = validateIssueReport(reportData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const newReport: IssueReport = {
      id: `report-${Date.now()}`,
      category,
      buildingId: buildingId || undefined,
      locationDescription,
      description,
      severity,
      imageAttachmentName: attachmentName || undefined,
      contactDetails: contactDetails.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'submitted_demo',
    };

    saveReport(newReport);
    onReportSubmitted(newReport);

    setSuccessMessage('Accessibility barrier report recorded successfully in local browser storage.');
    setLocationDescription('');
    setDescription('');
    setContactDetails('');
    setAttachmentName('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 6000);
  };

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Disclaimer Requirement (Section 14) */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demo Notice: </span>
          Demo mode: reports are stored in this browser only. They are not sent to college authorities.
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-teal-600 hover:text-teal-800"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label
              htmlFor="report-category"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Issue Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="report-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="broken_lift">Broken or Inactive Lift</option>
              <option value="blocked_ramp">Blocked or Obstructed Ramp</option>
              <option value="steep_slope">Steep / Hazardous Incline Slope</option>
              <option value="missing_handrail">Missing Handrail</option>
              <option value="uneven_pavement">Uneven or Cracked Pavement</option>
              <option value="inaccessible_entrance">Inaccessible Door / High Threshold</option>
              <option value="poor_signage">Missing Accessibility Signage</option>
              <option value="lighting_issue">Inadequate Walkway Lighting</option>
              <option value="other">Other Barrier</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label
              htmlFor="report-severity"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Severity Level
            </label>
            <select
              id="report-severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="low">Low (Minor inconvenience)</option>
              <option value="medium">Medium (Significant obstacle)</option>
              <option value="high">High (Severe barrier for wheelchairs)</option>
              <option value="critical">Critical (Safety hazard / total blockage)</option>
            </select>
          </div>
        </div>

        {/* Building Reference */}
        <div>
          <label
            htmlFor="report-building"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Associated Campus Building (Optional)
          </label>
          <select
            id="report-building"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">-- Campus Grounds / General Outdoor Area --</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code || b.category})
              </option>
            ))}
          </select>
        </div>

        {/* Location Specifics */}
        <div>
          <label
            htmlFor="report-location"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Specific Location Details <span className="text-rose-500">*</span>
          </label>
          <input
            id="report-location"
            type="text"
            placeholder="e.g., East Ramp entrance next to Admin Block porch"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.locationDescription && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.locationDescription}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="report-desc"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Detailed Barrier Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="report-desc"
            rows={3}
            placeholder="Describe what is preventing access, physical obstacles, or safety concerns..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.description && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Optional Image Attachment Simulation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Photo Attachment (Optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulateFile}
                className="hidden"
              />
            </label>
            {attachmentName ? (
              <span className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                <span>{attachmentName}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentName('')}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : (
              <span className="text-xs text-slate-400">No photo selected</span>
            )}
          </div>
        </div>

        {/* Optional Contact Details */}
        <div>
          <label
            htmlFor="report-contact"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Contact Details (Optional email for follow-up audit)
          </label>
          <input
            id="report-contact"
            type="text"
            placeholder="your-email@example.com"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.contactDetails && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.contactDetails}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <Send className="w-4 h-4 text-teal-300" />
          <span>Submit Local Demo Barrier Report</span>
        </button>
      </form>
    </div>
  );
};
