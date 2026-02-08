import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Preset, TreatmentStep, QuickTreatment } from '../types';
import { OptionToggles } from './preset-selector/OptionToggles';
import { PresetListView } from './preset-selector/PresetListView';
import { QuickStartGrid } from './preset-selector/QuickStartGrid';
import { TreatmentPreview } from './preset-selector/TreatmentPreview';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useListNavigation } from '../hooks/useListNavigation';
import { useGridNavigation } from '../hooks/useGridNavigation';
import { useTreatmentContext } from '../contexts/TreatmentContext';
import { PresetSelectorHeader } from './preset-selector/PresetSelectorHeader';
import { TractionSelector } from './preset-selector/TractionSelector';
import { ClearLogButton } from './preset-selector/ClearLogButton';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  onSelect: (bedId: number, presetId: string, options: any) => void;
  onCustomStart: (bedId: number, name: string, steps: TreatmentStep[], options: any) => void;
  onQuickStart: (bedId: number, template: QuickTreatment, options: any) => void;
  onStartTraction: (bedId: number, duration: number, options: any) => void;
  onClearLog?: () => void;
  targetBedId: number | null;
  initialOptions?: {
    isInjection: boolean;
    isManual: boolean;
    isESWT: boolean;
    isTraction: boolean;
    isFluid: boolean;
  };
  initialPreset?: Preset;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = memo(({
  isOpen,
  onClose,
  presets,
  onSelect,
  onCustomStart,
  onQuickStart,
  onStartTraction,
  onClearLog,
  targetBedId,
  initialOptions,
  initialPreset
}) => {
  const { quickTreatments } = useTreatmentContext();
  const [tractionDuration, setTractionDuration] = useState(15);
  const [previewPreset, setPreviewPreset] = useState<Preset | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Navigation focus: 'presets' or 'quick'
  const [navFocus, setNavFocus] = useState<'presets' | 'quick'>('presets');

  const [options, setOptions] = useState({
    isInjection: false,
    isManual: false,
    isESWT: false,
    isTraction: false,
    isFluid: false
  });

  const isTractionBed = targetBedId === 11;
  const isLogMode = targetBedId === 0;

  // Grid dimensions for QuickStartGrid (5 columns on desktop)
  const quickGridCols = 5;
  const quickGridRows = Math.ceil(quickTreatments.length / quickGridCols);

  // 1. Navigation for Preset List (1D vertical)
  const handlePresetSelect = useCallback((index: number) => {
    if (index >= 0 && index < presets.length) {
      setPreviewPreset(JSON.parse(JSON.stringify(presets[index])));
    }
  }, [presets]);

  const { selectedIndex: presetIndex, setSelectedIndex: setPresetIndex } = useListNavigation({
    itemCount: presets.length,
    onSelect: handlePresetSelect,
    active: isOpen && !previewPreset && !isTractionBed && navFocus === 'presets',
    containerRef: contentRef,
    onExitBottom: () => {
      // Move focus to QuickStartGrid
      setNavFocus('quick');
    }
  });

  // 2. Navigation for QuickStartGrid (2D grid)
  const handleQuickSelect = useCallback((row: number, col: number) => {
    const index = row * quickGridCols + col;
    if (index >= 0 && index < quickTreatments.length) {
      handleQuickItemClick(quickTreatments[index]);
    }
  }, [quickTreatments, quickGridCols]);

  const { selectedIndex: quickIndex, setPosition: setQuickPosition } = useGridNavigation({
    rows: quickGridRows,
    cols: quickGridCols,
    onSelect: handleQuickSelect,
    active: isOpen && !previewPreset && !isTractionBed && navFocus === 'quick',
    containerRef: contentRef,
    onExitTop: () => {
      // Move focus back to Preset List (last item)
      setNavFocus('presets');
      setPresetIndex(presets.length - 1);
    }
  });

  // 3. Keyboard Shortcut for General Actions (Esc, Enter for Confirm)
  useKeyboardShortcut({
    onEscape: isOpen ? () => {
      if (previewPreset) {
        setPreviewPreset(null);
      } else {
        onClose();
      }
    } : undefined,
    onEnter: () => {
      if (previewPreset) {
        handleConfirmStart();
      } else if (isTractionBed) {
        handleTractionStart();
      }
    },
    disableEnter: !isOpen || (!previewPreset && !isTractionBed)
  });

  useEffect(() => {
    if (isOpen) {
      setPresetIndex(0);
      setQuickPosition(0, 0);
      setNavFocus('presets');
      if (initialOptions) {
        setOptions(initialOptions);
      } else {
        setOptions({ isInjection: false, isManual: false, isESWT: false, isTraction: false, isFluid: false });
      }

      if (initialPreset) {
        setPreviewPreset(JSON.parse(JSON.stringify(initialPreset)));
      } else {
        setPreviewPreset(null);
      }
    }
  }, [isOpen, initialOptions, initialPreset]);

  if (!isOpen || targetBedId === null) return null;

  const handleTractionStart = () => {
    onStartTraction(targetBedId, tractionDuration, options);
    onClose();
  };

  const handleConfirmStart = () => {
    if (previewPreset) {
      onCustomStart(targetBedId, previewPreset.name, previewPreset.steps, options);
      onClose();
    }
  };

  const handleQuickItemClick = (template: QuickTreatment) => {
    const initialStep: TreatmentStep = {
      id: crypto.randomUUID(),
      name: template.name,
      duration: template.duration * 60,
      enableTimer: template.enableTimer,
      color: template.color
    };

    setPreviewPreset({
      id: `temp-${Date.now()}`,
      name: template.name,
      steps: [initialStep]
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[500px] max-h-[90vh] sm:max-h-[95vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={e => e.stopPropagation()}
      >
        <PresetSelectorHeader
          targetBedId={targetBedId}
          isLogMode={isLogMode}
          isTractionBed={isTractionBed}
          previewPreset={previewPreset}
          onBack={() => setPreviewPreset(null)}
          onClose={onClose}
        />

        {/* Options Area */}
        <OptionToggles options={options} setOptions={setOptions} />

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-2 sm:p-3 relative">
          {previewPreset ? (
            <TreatmentPreview
              preset={previewPreset}
              setPreset={setPreviewPreset}
              onConfirm={handleConfirmStart}
              actionLabel={isLogMode ? "수정 완료" : "치료 시작"}
              isLogEdit={isLogMode}
            />
          ) : isTractionBed ? (
            <TractionSelector
              tractionDuration={tractionDuration}
              setTractionDuration={setTractionDuration}
              onStart={handleTractionStart}
              isLogMode={isLogMode}
            />
          ) : (
            // Standard Preset & Quick List
            <div className="flex flex-col gap-4 pb-20">
              <PresetListView
                presets={presets}
                onSelect={(p) => setPreviewPreset(JSON.parse(JSON.stringify(p)))}
                highlightedIndex={navFocus === 'presets' ? presetIndex : -1}
                onHoverIndex={(idx) => {
                  setNavFocus('presets');
                  setPresetIndex(idx);
                }}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 dark:bg-slate-950 px-3 text-xs font-bold text-gray-400">OR</span>
                </div>
              </div>

              <QuickStartGrid
                onQuickStart={handleQuickItemClick}
                highlightedIndex={navFocus === 'quick' ? quickIndex : -1}
                onHoverIndex={(idx) => {
                  setNavFocus('quick');
                  const row = Math.floor(idx / quickGridCols);
                  const col = idx % quickGridCols;
                  setQuickPosition(row, col);
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Actions (Only for Log Mode or standard footer) */}
        {isLogMode && onClearLog && !previewPreset && !isTractionBed && (
          <ClearLogButton onClear={() => { onClearLog(); onClose(); }} />
        )}
      </div>
    </div>
  );
});
