import React from 'react';
import { Download } from 'lucide-react';
import GoogleAd from './GoogleAd';

export interface TextState {
    content: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: number;
    color: string;
    fontFamily: string;
    isBehind: boolean;
}

interface TextEditorSidebarProps {
    textState: TextState;
    setTextState: (state: TextState) => void;
    onDownload: () => void;
}

export default function TextEditorSidebar({ textState, setTextState, onDownload }: TextEditorSidebarProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: keyof TextState, value: any) => {
        setTextState({ ...textState, [key]: value });
    };

    return (
        <div className="w-full lg:w-80 bg-gray-900 border-l lg:border-l-0 border-gray-800 p-6 flex flex-col gap-6 h-auto lg:h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-2">Text Settings</h2>

            {/* Content */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Content</label>
                <textarea
                    value={textState.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-400">Size</label>
                    <span className="text-xs text-gray-500">{textState.fontSize}px</span>
                </div>
                <input
                    type="range"
                    min="20"
                    max="300"
                    value={textState.fontSize}
                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-400">Weight</label>
                    <span className="text-xs text-gray-500">{textState.fontWeight}</span>
                </div>
                <input
                    type="range"
                    min="100"
                    max="900"
                    step="100"
                    value={textState.fontWeight}
                    onChange={(e) => handleChange('fontWeight', Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Color */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={textState.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-sm text-gray-300 uppercase">{textState.color}</span>
                </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Font</label>
                <select
                    value={textState.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="var(--font-inter)">Inter</option>
                    <option value="var(--font-anton)">Anton</option>
                    <option value="var(--font-pacifico)">Pacifico</option>
                    <option value="var(--font-playfair)">Playfair Display</option>
                </select>
            </div>

            {/* Layer Depth */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Position</label>
                <div className="flex bg-gray-800 rounded-md p-1 border border-gray-700">
                    <button
                        onClick={() => handleChange('isBehind', true)}
                        className={`flex-1 py-1 px-2 text-sm rounded ${textState.isBehind ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Behind
                    </button>
                    <button
                        onClick={() => handleChange('isBehind', false)}
                        className={`flex-1 py-1 px-2 text-sm rounded ${!textState.isBehind ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        In Front
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800 space-y-4">
                <button
                    onClick={onDownload}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download Image
                </button>
                <p className="text-xs text-gray-500 text-center">Drag text on canvas to move.</p>

                {/* AdSense: Sidebar Square */}
                <div className="hidden lg:block pt-4">
                    <GoogleAd slot="5751695131" style={{ width: '300px', height: '250px' }} />
                </div>
            </div>
        </div>
    );
}
