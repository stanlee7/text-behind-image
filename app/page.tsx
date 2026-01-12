'use client';

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import LayerCanvas, { LayerCanvasHandle } from '@/components/LayerCanvas';
import TextEditorSidebar, { TextState } from '@/components/TextEditorSidebar';
import BackgroundRemover from '@/utils/backgroundRemoval';
import { Loader2 } from 'lucide-react';
import MarketingSection from '@/components/MarketingSection';
import Footer from '@/components/Footer';
import ShowcaseSection from '@/components/ShowcaseSection';
import GoogleAd from '@/components/GoogleAd';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref for the hidden file input (Change Image)
  const changeImageInputRef = React.useRef<HTMLInputElement>(null);

  const canvasRef = React.useRef<LayerCanvasHandle>(null);

  const initialTextState: TextState = {
    content: 'TEXT BEHIND',
    x: 400,
    y: 400,
    fontSize: 120,
    fontWeight: 800,
    color: '#ffffff',
    fontFamily: 'sans-serif',
    isBehind: true,
  };

  const [textState, setTextState] = useState<TextState>(initialTextState);

  const handleImageSelect = async (file: File, isChange: boolean = false) => {
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setForegroundImage(null); // Clear previous
    setIsProcessing(true);

    try {
      // 1. Get image dimensions to center text
      const img = new Image();
      img.src = url;
      img.onload = () => {
        // Only center text if it's a NEW session, otherwise keep user's position/style
        if (!isChange) {
          setTextState(prev => ({
            ...prev,
            x: img.width / 2,
            y: img.height / 2
          }));
        }
      };

      // 2. Remove Background (Call Python Backend)
      // 2. Remove Background (Call Python Backend)
      const fgUrl = await BackgroundRemover.removeBackground(file);
      if (fgUrl) {
        setForegroundImage(fgUrl);
      }
      setIsProcessing(false);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert(`배경 제거 실패: ${(error as any).message}`);
    }


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
        setTextState(initialTextState);
      }
    } else {
      // Already home, do nothing or reload
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
                textState={textState}
                onTextUpdate={setTextState}
              />
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-gray-700 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50">
                <Loader2 className="animate-spin w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold tracking-wide">Removing Background...</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Fixed to the right within this section */}
        {originalImage && (
          <div className="h-auto lg:h-full w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 pt-0 lg:pt-16 lg:sticky lg:top-0 z-20">
            <TextEditorSidebar
              textState={textState}
              setTextState={setTextState}
              onDownload={handleDownload}
            />
          </div>
        )}
      </div>

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
