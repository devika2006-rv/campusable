import React, { useState } from 'react';
import {
  AIInterpretationResult,
  Building,
  MapImportData,
} from '../../types/campus';
import { validateImageFile } from '../../utils/validation';
import { AIMapService } from '../../services/aiMapService';
import { saveMapImport } from '../../utils/storage';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';

interface Props {
  onCommitCandidates?: (buildings: Partial<Building>[]) => void;
}

export const ImageImportForm: React.FC<Props> = ({ onCommitCandidates }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mapTitle, setMapTitle] = useState<string>('Campus Site Board / Aerial Reference');
  const [sourceNotes, setSourceNotes] = useState<string>('Campus entrance information board photo');
  const [orientationNotes, setOrientationNotes] = useState<string>('True North aligned approximately 15° clockwise from top');
  const [knownLandmarks, setKnownLandmarks] = useState<string>('Main Gate, Decennial Block, Central Lawn, Parking Portico');
  const [knownBuildingLabels, setKnownBuildingLabels] = useState<string>('Administrative Block, North Block, South Block, Auditorium');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIInterpretationResult | null>(null);
  const [humanReviewCompleted, setHumanReviewCompleted] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const check = validateImageFile(selected);
      if (!check.isValid) {
        setValidationError(check.message || 'Invalid image file.');
        return;
      }

      setValidationError(null);
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = async () => {
    if (!previewUrl) return;

    setIsAnalyzing(true);
    setValidationError(null);

    const importData: MapImportData = {
      id: `map-import-${Date.now()}`,
      title: mapTitle,
      imageDataUrl: previewUrl,
      fileName: file ? file.name : 'pasted-reference.png',
      fileSizeKb: file ? Math.round(file.size / 1024) : 256,
      sourceNotes,
      orientationNotes,
      knownLandmarks: knownLandmarks.split(',').map((s) => s.trim()).filter(Boolean),
      knownBuildingLabels: knownBuildingLabels.split(',').map((s) => s.trim()).filter(Boolean),
      uploadedAt: new Date().toISOString(),
    };

    saveMapImport(importData);

    try {
      const result = await AIMapService.analyzeMapReference(importData);
      setAnalysisResult(result);
    } catch (err) {
      setValidationError('Failed to interpret map reference.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header and Integrity Notice */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">
            Campus Map Image Import & Interpretation
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
            AI-Assisted Workflow
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Upload a high-resolution photograph of the campus guide board, site plan, or architectural schematic (PNG, JPG, WebP).
        </p>
      </div>

      {/* Strict Limitations Alert (Section 16) */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Ground-Truth & Architectural Guidelines</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li>
            A single map image cannot reliably reveal hidden building sides, elevations, indoor layouts, or physical ramp grades.
          </li>
          <li>
            AI-generated elements are treated strictly as <strong className="text-slate-800">unverified suggestions</strong>.
          </li>
          <li>
            Human audit and calibration are required before promoting candidate structures to the verified campus database.
          </li>
          <li>
            Secure Backend Ready: Works locally without exposing any API keys in client-side code.
          </li>
        </ul>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Upload & Preview Box */}
      <div className="space-y-4">
        {!previewUrl ? (
          <label className="border-2 border-dashed border-slate-300 hover:border-purple-600 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-purple-50/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Select or Drag Campus Map Image
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WebP up to 15MB
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900/5 relative group">
            <div className="max-h-80 overflow-hidden flex items-center justify-center bg-slate-100">
              <img
                src={previewUrl}
                alt="Uploaded campus reference"
                className="max-h-80 object-contain w-auto mx-auto"
              />
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-600 truncate max-w-xs font-mono">
                {file ? `${file.name} (${(file.size / 1024).toFixed(0)} KB)` : 'Map Reference Preview'}
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs font-semibold text-purple-800 hover:text-purple-950 p-1">
                  Replace Image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Map Title / Context
          </label>
          <input
            type="text"
            value={mapTitle}
            onChange={(e) => setMapTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Orientation Notes
          </label>
          <input
            type="text"
            value={orientationNotes}
            onChange={(e) => setOrientationNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Known Landmarks on this Map (Comma separated)
          </label>
          <input
            type="text"
            value={knownLandmarks}
            onChange={(e) => setKnownLandmarks(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
            Known Building Labels to Extract (Comma separated)
          </label>
          <input
            type="text"
            value={knownBuildingLabels}
            onChange={(e) => setKnownBuildingLabels(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Trigger Analysis Button */}
      {previewUrl && (
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Map Reference & Extracting Spatial Candidates...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Interpretation & Candidate Extraction</span>
            </>
          )}
        </button>
      )}

      {/* Analysis Candidates Review Table */}
      {analysisResult && (
        <div className="pt-6 border-t border-slate-200 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Extracted Map Candidates</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  Requires Human Review
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Model: {analysisResult.modelIdentifier} • Overall Confidence: {Math.round(analysisResult.overallConfidence * 100)}%
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
            <span className="font-bold">Disclaimer: </span>
            {analysisResult.disclaimer}
          </div>

          {/* Candidate Buildings */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Candidate Buildings Detected ({analysisResult.candidateBuildings.length})
            </h4>
            <div className="space-y-2">
              {analysisResult.candidateBuildings.map((cand) => (
                <div
                  key={cand.candidateId}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-slate-900">{cand.suggestedName}</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{cand.notes}</p>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Footprint: {cand.approximateBounds.width}m x {cand.approximateBounds.height}m • {cand.detectedEntrancesCount} visible portals
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[11px]">
                      {Math.round(cand.confidenceScore * 100)}% conf
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Human Review Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Human Auditor Verification Checklist
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {analysisResult.recommendedHumanReviewItems.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
