import React from 'react';
import { Download, Plus, Copy, Trash2 } from 'lucide-react';
import { TextLayer, FONT_OPTIONS } from '@/utils/text';
import GoogleAd from './GoogleAd';

interface TextEditorSidebarProps {
    layers: TextLayer[];
    selectedLayerId: string | null;
    onSelectLayer: (id: string) => void;
    onUpdateLayer: (id: string, patch: Partial<TextLayer>) => void;
    onAddLayer: () => void;
    onDeleteLayer: (id: string) => void;
    onDuplicateLayer: (id: string) => void;
    onDownload: () => void;
}

function Slider({
    label, value, min, max, step = 1, unit = '', onChange,
}: {
    label: string; value: number; min: number; max: number; step?: number; unit?: string;
    onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-400">{label}</label>
                <span className="text-xs text-gray-500">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-blue-500"
            />
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase">{value}</span>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                />
            </div>
        </div>
    );
}

export default function TextEditorSidebar({
    layers,
    selectedLayerId,
    onSelectLayer,
    onUpdateLayer,
    onAddLayer,
    onDeleteLayer,
    onDuplicateLayer,
    onDownload,
}: TextEditorSidebarProps) {
    const selected = layers.find(l => l.id === selectedLayerId) ?? null;

    const handleChange = <K extends keyof TextLayer>(key: K, value: TextLayer[K]) => {
        if (selected) onUpdateLayer(selected.id, { [key]: value });
    };

    return (
        <div className="w-full lg:w-80 bg-gray-900 border-l lg:border-l-0 border-gray-800 p-6 flex flex-col gap-6 h-auto lg:h-full overflow-y-auto">

            {/* Layer List */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">텍스트 레이어</h2>
                    <button
                        onClick={onAddLayer}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-200 transition-colors"
                    >
                        <Plus className="w-3 h-3" /> 추가
                    </button>
                </div>
                <div className="space-y-1.5">
                    {layers.map(layer => (
                        <div
                            key={layer.id}
                            onClick={() => onSelectLayer(layer.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border transition-colors ${
                                layer.id === selectedLayerId
                                    ? 'bg-blue-600/20 border-blue-500/60'
                                    : 'bg-gray-800/60 border-gray-700/60 hover:bg-gray-800'
                            }`}
                        >
                            <span className="flex-1 text-sm text-gray-200 truncate">
                                {layer.content.split('\n')[0] || '(빈 텍스트)'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                                layer.isBehind ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                                {layer.isBehind ? '뒤' : '앞'}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDuplicateLayer(layer.id); }}
                                title="레이어 복제"
                                className="text-gray-500 hover:text-white transition-colors shrink-0"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
                                title="레이어 삭제"
                                disabled={layers.length === 1}
                                className="text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors shrink-0"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selected && (
                <>
                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">내용 (줄바꿈 가능)</label>
                        <textarea
                            value={selected.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Layer Depth */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">위치</label>
                        <div className="flex bg-gray-800 rounded-md p-1 border border-gray-700">
                            <button
                                onClick={() => handleChange('isBehind', true)}
                                className={`flex-1 py-1 px-2 text-sm rounded ${selected.isBehind ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                인물 뒤
                            </button>
                            <button
                                onClick={() => handleChange('isBehind', false)}
                                className={`flex-1 py-1 px-2 text-sm rounded ${!selected.isBehind ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                인물 앞
                            </button>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">폰트</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {FONT_OPTIONS.map(font => (
                                <button
                                    key={font.value}
                                    onClick={() => handleChange('fontFamily', font.value)}
                                    style={{ fontFamily: font.value }}
                                    className={`py-2 px-2 text-sm rounded-md border truncate transition-colors ${
                                        selected.fontFamily === font.value
                                            ? 'bg-blue-600/20 border-blue-500/60 text-white'
                                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {font.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Slider label="크기" value={selected.fontSize} min={20} max={500} unit="px"
                        onChange={(v) => handleChange('fontSize', v)} />
                    <Slider label="굵기" value={selected.fontWeight} min={100} max={900} step={100}
                        onChange={(v) => handleChange('fontWeight', v)} />
                    <ColorInput label="색상" value={selected.color}
                        onChange={(v) => handleChange('color', v)} />
                    <Slider label="투명도" value={selected.opacity} min={0} max={100} unit="%"
                        onChange={(v) => handleChange('opacity', v)} />
                    <Slider label="회전" value={selected.rotation} min={-180} max={180} unit="°"
                        onChange={(v) => handleChange('rotation', v)} />
                    <Slider label="자간" value={selected.letterSpacing} min={-20} max={100} unit="px"
                        onChange={(v) => handleChange('letterSpacing', v)} />

                    {/* Stroke */}
                    <div className="space-y-3 pt-4 border-t border-gray-800">
                        <Slider label="외곽선" value={selected.strokeWidth} min={0} max={30} unit="px"
                            onChange={(v) => handleChange('strokeWidth', v)} />
                        {selected.strokeWidth > 0 && (
                            <ColorInput label="외곽선 색상" value={selected.strokeColor}
                                onChange={(v) => handleChange('strokeColor', v)} />
                        )}
                    </div>

                    {/* Shadow */}
                    <div className="space-y-3">
                        <Slider label="그림자" value={selected.shadowBlur} min={0} max={100}
                            onChange={(v) => handleChange('shadowBlur', v)} />
                        {selected.shadowBlur > 0 && (
                            <ColorInput label="그림자 색상" value={selected.shadowColor}
                                onChange={(v) => handleChange('shadowColor', v)} />
                        )}
                    </div>
                </>
            )}

            <div className="mt-auto pt-6 border-t border-gray-800 space-y-4">
                <button
                    onClick={onDownload}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    이미지 저장
                </button>
                <p className="text-xs text-gray-500 text-center">캔버스에서 텍스트를 드래그해 옮길 수 있어요.</p>

                {/* AdSense: Sidebar Square */}
                <div className="hidden lg:block pt-4">
                    <GoogleAd slot="5751695131" style={{ width: '300px', height: '250px' }} />
                </div>
            </div>
        </div>
    );
}
