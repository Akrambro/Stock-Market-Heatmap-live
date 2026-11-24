import { useState } from 'react';
import { X } from 'lucide-react';
import type { ColorScaleConfig, ColorScalePresetId } from '../types/market';
import {
  buildColorBuckets,
  COLOR_SCALE_PRESETS,
  DEFAULT_COLOR_SCALE,
  normalizeThresholds,
} from '../utils/heatmapLogic';

interface ColorScaleModalProps {
  config: ColorScaleConfig;
  onApply: (next: ColorScaleConfig) => void;
  onClose: () => void;
}

export function ColorScaleModal({
  config,
  onApply,
  onClose,
}: ColorScaleModalProps) {
  const [draft, setDraft] = useState<ColorScaleConfig>(() => ({
    presetId: config.presetId,
    thresholds: [...config.thresholds] as [number, number, number, number],
    colors: { ...config.colors },
  }));

  const previewBuckets = buildColorBuckets(draft);

  const handleSelectPreset = (
    presetId: Exclude<ColorScalePresetId, 'CUSTOM'>
  ) => {
    const preset = COLOR_SCALE_PRESETS[presetId].config;
    setDraft({
      presetId,
      thresholds: [...preset.thresholds] as [number, number, number, number],
      colors: { ...preset.colors },
    });
  };

  const handleThresholdChange = (index: 0 | 1 | 2 | 3, value: string) => {
    const parsed = Number.parseFloat(value);
    const next: [number, number, number, number] = [...draft.thresholds] as [
      number,
      number,
      number,
      number,
    ];
    next[index] = Number.isFinite(parsed) && parsed > 0 ? parsed : 0.5;
    setDraft((prev) => ({
      ...prev,
      presetId: 'CUSTOM',
      thresholds: next,
    }));
  };

  const handleColorChange = (
    key: keyof ColorScaleConfig['colors'],
    hex: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      presetId: 'CUSTOM',
      colors: {
        ...prev.colors,
        [key]: hex,
      },
    }));
  };

  const handleSave = () => {
    onApply({
      ...draft,
      thresholds: normalizeThresholds(draft.thresholds),
    });
    onClose();
  };

  const colorFields: {
    key: keyof ColorScaleConfig['colors'];
    label: string;
  }[] = [
    { key: 'maxLoss', label: 'Max Loss' },
    { key: 'midLoss', label: 'Mid Loss' },
    { key: 'minLoss', label: 'Mild Loss' },
    { key: 'flat', label: 'Flat (0%)' },
    { key: 'minGain', label: 'Mild Gain' },
    { key: 'midGain', label: 'Mid Gain' },
    { key: 'maxGain', label: 'Max Gain' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="color-scale-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2
              id="color-scale-dialog-title"
              className="text-base font-semibold text-slate-50"
            >
              Custom Color Scale &amp; Percentage Thresholds
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Configure TradeTiger percentage breakpoints and gain/loss palette
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close color scale customizer"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Presets */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Terminal Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                Object.keys(COLOR_SCALE_PRESETS) as Exclude<
                  ColorScalePresetId,
                  'CUSTOM'
                >[]
              ).map((presetKey) => {
                const active = draft.presetId === presetKey;
                return (
                  <button
                    key={presetKey}
                    type="button"
                    onClick={() => handleSelectPreset(presetKey)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {COLOR_SCALE_PRESETS[presetKey].name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thresholds */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Symmetric % Breakpoints (1% – 4% default)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([0, 1, 2, 3] as const).map((idx) => (
                <label
                  key={idx}
                  className="flex flex-col gap-1 text-xs text-slate-400"
                >
                  <span>Band {idx + 1} (±%)</span>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="20"
                    value={draft.thresholds[idx]}
                    onChange={(e) => handleThresholdChange(idx, e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Gradient Anchor Colors
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colorFields.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-300"
                >
                  <span>{label}</span>
                  <input
                    type="color"
                    aria-label={`${label} color`}
                    value={draft.colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Live 11-Bucket Preview */}
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Live 11-Bucket Scale Preview
            </span>
            <div className="grid grid-cols-11 gap-1 rounded-md border border-slate-800 bg-slate-950 p-2">
              {previewBuckets.map((b) => (
                <div
                  key={b.id}
                  style={{ backgroundColor: b.bgHex, color: b.textHex }}
                  className="rounded py-2 px-1 text-center font-mono text-[10px] font-semibold"
                >
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() =>
              setDraft({
                presetId: DEFAULT_COLOR_SCALE.presetId,
                thresholds: [...DEFAULT_COLOR_SCALE.thresholds] as [
                  number,
                  number,
                  number,
                  number,
                ],
                colors: { ...DEFAULT_COLOR_SCALE.colors },
              })
            }
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-700 bg-slate-950 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
            >
              Apply Scale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
