'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import LayerCanvas, { LayerCanvasHandle } from '@/components/LayerCanvas';
import TextEditorSidebar from '@/components/TextEditorSidebar';
import { TextLayer, createTextLayer } from '@/utils/text';
import BackgroundRemover from '@/utils/backgroundRemoval';
import { Loader2, AlertCircle, X } from 'lucide-react';
import MarketingSection from '@/components/MarketingSection';
import Footer from '@/components/Footer';
import ShowcaseSection from '@/components/ShowcaseSection';
import GoogleAd from '@/components/GoogleAd';

interface Progress {
  stage: 'download' | 'process';
  percent: number;
}

const fitFontSize = (imageWidth: number) =>
  Math.max(40, Math.min(400, Math.round(imageWidth / 6)));

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 800, height: 800 });

  const [layers, setLayers] = useState<TextLayer[]>(() => [createTextLayer(400, 400, 120)]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Ref for the hidden file input (Change Image)
  const changeImageInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<LayerCanvasHandle>(null);

  // Auto-dismiss error toast
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const handleImageSelect = async (file: File, isChange: boolean = false) => {
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setForegroundImage(null); // Clear previous
    setIsProcessing(true);
    setProgress(null);
    setErrorMsg(null);

    // 1. Get image dimensions to center/scale text
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      // Only reset layers on a NEW session, otherwise keep user's work
      if (!isChange) {
        const layer = createTextLayer(img.width / 2, img.height / 2, fitFontSize(img.width));
        setLayers([layer]);
        setSelectedLayerId(layer.id);
      }
    };

    // 2. Remove Background (client-side AI)
    try {
      const fgUrl = await BackgroundRemover.removeBackground(file, (key, current, total) => {
        setProgress({
          stage: key.startsWith('fetch') ? 'download' : 'process',
          percent: total > 0 ? Math.round((current / total) * 100) : 0,
        });
      });
      if (fgUrl) {
        setForegroundImage(fgUrl);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('배경 제거에 실패했습니다. 잠시 후 다시 시도하거나 다른 이미지를 사용해 주세요.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  // Layer operations
  const handleUpdateLayer = (id: string, patch: Partial<TextLayer>) => {
    setLayers(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
  };

  const handleAddLayer = () => {
    const layer = createTextLayer(
      imageSize.width / 2,
      imageSize.height / 2 + layers.length * imageSize.height * 0.08,
      fitFontSize(imageSize.width),
      '새 텍스트'
    );
    setLayers(prev => [...prev, layer]);
    setSelectedLayerId(layer.id);
  };

  const handleDeleteLayer = (id: string) => {
    setLayers(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(l => l.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  };

  const handleDuplicateLayer = (id: string) => {
    const source = layers.find(l => l.id === id);
    if (!source) return;
    const offset = Math.round(imageSize.width * 0.03);
    const fresh = createTextLayer(source.x + offset, source.y + offset, source.fontSize);
    const duplicated: TextLayer = { ...source, id: fresh.id, x: fresh.x, y: fresh.y };
    setLayers(prev => [...prev, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  const handleDownload = () => {
    canvasRef.current?.download();
  };

  // Navigation: Back to Home
  const handleLogoClick = () => {
    if (originalImage) {
      if (confirm('작업 내용이 사라집니다. 메인으로 돌아가시겠습니까?')) {
        setOriginalImage(null);
        setForegroundImage(null);
        const layer = createTextLayer(400, 400, 120);
        setLayers([layer]);
        setSelectedLayerId(null);
      }
    }
  };

  // Action: Change Image
  const handleChangeImageClick = () => {
    changeImageInputRef.current?.click();
  };

  const handleChangeImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0], true);
    }
    // Reset input value so same file can be selected again if needed
    if (changeImageInputRef.current) {
      changeImageInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen w-full bg-black text-white font-[family-name:var(--font-noto-sans-kr)] selection:bg-blue-500 selection:text-white flex flex-col">

      {/* 1. App / Editor Section */}
      <div className="flex-grow flex flex-col lg:flex-row w-full border-b border-gray-800 relative bg-neutral-900/50 min-h-[calc(100vh-64px)] lg:min-h-[800px]">

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative min-h-[50vh] lg:min-h-0">
          <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur z-10 w-full absolute top-0 left-0">
            <button onClick={handleLogoClick} className="text-xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity z-50">
              누끼 텍스트
            </button>

            {/* Change Image Button (Only visible when editor is active) */}
            {originalImage && (
              <div className="flex gap-4 z-50">
                <input
                  type="file"
                  ref={changeImageInputRef}
                  onChange={handleChangeImageFile}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={handleChangeImageClick}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 hover:bg-gray-700 text-xs md:text-sm font-medium rounded-lg transition-colors border border-gray-700 text-gray-200"
                >
                  이미지 변경
                </button>
              </div>
            )}
          </header>

          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden pt-16">
            {!originalImage ? (
              <div className="max-w-2xl w-full text-center space-y-6">
                <h2 className="text-4xl md:text-6xl font-extrabold pb-2 animate-shimmer bg-[linear-gradient(110deg,#ffffff_45%,#c084fc_50%,#ffffff_55%)] bg-[length:200%_100%] bg-clip-text text-transparent break-keep leading-tight">
                  밋밋한 사진에<br />깊이감을 더하다
                </h2>
                <p
                  className="text-gray-400 text-lg md:text-xl break-keep px-4 leading-relaxed animate-fade-in-up opacity-0"
                  style={{ animationDelay: '0.3s' }}
                >
                  복잡한 포토샵 없이, AI가 자동으로 인물을 인식해 텍스트를 뒤로 넣어줍니다. <br className="hidden md:block" />
                  유튜브 썸네일, 인스타 피드를 1초 만에 완성하세요.
                </p>
                <div
                  className="pt-10 flex justify-center animate-fade-in-up opacity-0"
                  style={{ animationDelay: '0.6s' }}
                >
                  <ImageUploader onImageSelect={(file) => handleImageSelect(file, false)} />
                </div>
              </div>
            ) : (
              <LayerCanvas
                ref={canvasRef}
                originalImageUrl={originalImage}
                foregroundImageUrl={foregroundImage}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onLayerUpdate={handleUpdateLayer}
              />
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-gray-700 text-white px-6 py-3 rounded-full flex flex-col items-center gap-1 shadow-2xl z-50">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold tracking-wide">
                    {progress?.stage === 'download'
                      ? `AI 모델 다운로드 중... ${progress.percent}%`
                      : progress
                        ? `배경 제거 중... ${progress.percent}%`
                        : 'AI 분석 준비 중...'}
                  </span>
                </div>
                {progress?.stage === 'download' && (
                  <span className="text-[11px] text-gray-400">최초 1회만 다운로드해요. 다음부터는 빨라집니다.</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Fixed to the right within this section */}
        {originalImage && (
          <div className="h-auto lg:h-full w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 pt-0 lg:pt-16 lg:sticky lg:top-0 z-20">
            <TextEditorSidebar
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              onAddLayer={handleAddLayer}
              onDeleteLayer={handleDeleteLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onDownload={handleDownload}
            />
          </div>
        )}
      </div>

      {/* Error Toast */}
      {errorMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-950/95 border border-red-700 text-red-100 px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl z-[100] max-w-[90vw]">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-300 hover:text-white shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AdSense: Middle Banner */}
      <div className="w-full flex justify-center my-12">
        <div className="w-full max-w-4xl px-4">
          <GoogleAd slot="1074083526" format="auto" responsive={true} />
        </div>
      </div>

      {/* 2. Showcase Section (Gallery) */}
      <ShowcaseSection />

      {/* 3. Marketing Section */}
      <MarketingSection />

      {/* AdSense: Bottom Multiplex */}
      <div className="w-full flex justify-center py-10 bg-gray-50 border-t border-gray-100">
        <div className="w-full max-w-7xl px-4">
          <GoogleAd slot="4960345882" format="autorelaxed" responsive={true} />
        </div>
      </div>

      {/* 4. Footer */}
      <Footer />
    </main>
  );
}
