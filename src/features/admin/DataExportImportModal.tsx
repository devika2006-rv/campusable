import React, { useState } from 'react';
import { CampusDataset } from '../../types/campus';
import { validateCampusDataset, ValidationResult } from '../../utils/validation';
import { Download, Upload, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  dataset: CampusDataset;
  isOpen: boolean;
  onClose: () => void;
  onImportValidDataset: (imported: CampusDataset) => void;
}

export const DataExportImportModal: React.FC<Props> = ({
  dataset,
  isOpen,
  onClose,
  onImportValidDataset,
}) => {
  if (!isOpen) return null;

  const [importText, setImportText] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataset, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `campusable-dataset-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleValidateAndImport = () => {
    try {
      const parsed = JSON.parse(importText);
      const res = validateCampusDataset(parsed);
      setValidationResult(res);

      if (res.isValid) {
        onImportValidDataset(parsed as CampusDataset);
        alert('Campus dataset successfully validated and imported!');
        onClose();
      }
    } catch (e: any) {
      setValidationResult({
        isValid: false,
        errors: [{ field: 'json_syntax', message: `Malformed JSON: ${e.message}`, severity: 'error' }],
        warnings: [],
      });
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Campus Data JSON Export & Import
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export current dataset or import external verified audits
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-sm">Download Current Dataset</div>
              <p className="text-xs text-slate-500">
                Includes all {dataset.buildings.length} buildings, {dataset.routeNodes.length} nodes, and {dataset.routeEdges.length} pathway edges.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Import & Validate JSON Dataset
            </label>
            <label className="cursor-pointer text-xs font-semibold text-teal-700 hover:text-teal-900">
              Upload JSON file
              <input type="file" accept=".json" onChange={handleFileDrop} className="hidden" />
            </label>
          </div>

          <textarea
            rows={7}
            placeholder="Paste JSON dataset here or choose a file above..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {validationResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                validationResult.isValid
                  ? 'bg-teal-50 border-teal-200 text-teal-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>JSON Schema & Relations are Valid!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Dataset Validation Errors Found:</span>
                  </>
                )}
              </div>

              {validationResult.errors.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>
                      <code>{err.field}</code>: {err.message}
                    </li>
                  ))}
                </ul>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="pt-2 border-t border-amber-200 text-amber-800">
                  <div className="font-semibold mb-1">Warnings:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {validationResult.warnings.map((w, i) => (
                      <li key={i}>
                        <code>{w.field}</code>: {w.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleValidateAndImport}
              disabled={!importText.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Validate & Apply Dataset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
