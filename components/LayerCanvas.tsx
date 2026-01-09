import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { TextState } from './TextEditorSidebar';

interface LayerCanvasProps {
    originalImageUrl: string | null;
    foregroundImageUrl: string | null;
    textState: TextState;
    onTextUpdate: (textState: TextState) => void;
}

export interface LayerCanvasHandle {
    download: () => void;
}

const LayerCanvas = forwardRef<LayerCanvasHandle, LayerCanvasProps>(({
    originalImageUrl,
    foregroundImageUrl,
    textState,
    onTextUpdate,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Local state for smooth dragging without parent re-renders
    const [localTextState, setLocalTextState] = useState<TextState>(textState);
    const [images, setImages] = useState<{ bg: HTMLImageElement | null; fg: HTMLImageElement | null }>({
        bg: null,
        fg: null,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
        download: () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }));

    // Sync props to local state when not dragging
    useEffect(() => {
        if (!isDragging) {
            setLocalTextState(textState);
        }
    }, [textState, isDragging]);

    // Load images
    useEffect(() => {
        let bgImg: HTMLImageElement | null = null;
        let fgImg: HTMLImageElement | null = null;

        if (originalImageUrl) {
            bgImg = new Image();
            bgImg.src = originalImageUrl;
            bgImg.onload = () => {
                setImages(prev => ({ ...prev, bg: bgImg }));
            };
        } else {
            setImages(prev => ({ ...prev, bg: null }));
        }

        if (foregroundImageUrl) {
            fgImg = new Image();
            fgImg.src = foregroundImageUrl;
            fgImg.onload = () => {
                setImages(prev => ({ ...prev, fg: fgImg }));
            };
        } else {
            setImages(prev => ({ ...prev, fg: null }));
        }
    }, [originalImageUrl, foregroundImageUrl]);

    // Draw function
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !images.bg) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use natural size
        if (canvas.width !== images.bg.width || canvas.height !== images.bg.height) {
            canvas.width = images.bg.width;
            canvas.height = images.bg.height;
        }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Helper functions
        const drawBackground = () => {
            if (images.bg) ctx.drawImage(images.bg, 0, 0);
        };

        const drawForeground = () => {
            if (images.fg) ctx.drawImage(images.fg, 0, 0);
        };

        const drawText = () => {
            ctx.save();
            // Hack to resolve var(--font-name) to actual font family using getComputedStyle
            let fontFamily = localTextState.fontFamily;
            if (fontFamily.startsWith('var(')) {
                const varName = fontFamily.match(/var\(([^)]+)\)/)?.[1];
                if (varName) {
                    const computed = getComputedStyle(document.body).getPropertyValue(varName);
                    if (computed) fontFamily = computed.replace(/"/g, '');
                }
            }

            ctx.font = `${localTextState.fontWeight} ${localTextState.fontSize}px ${fontFamily || 'sans-serif'}`;
            ctx.fillStyle = localTextState.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(localTextState.content, localTextState.x, localTextState.y);
            ctx.restore();
        };

        // Strictly follow User's requested order
        if (localTextState.isBehind) {
            // 1. Behind Mode: BG -> Text -> FG
            drawBackground();
            drawText();
            drawForeground();
        } else {
            // 2. Front Mode: BG -> FG -> Text
            drawBackground();
            drawForeground();
            drawText();
        }

    }, [images, localTextState]);

    // Handle Mouse Events
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.font = `${localTextState.fontWeight} ${localTextState.fontSize}px ${localTextState.fontFamily || 'sans-serif'}`;
        const metrics = ctx.measureText(localTextState.content);
        const textWidth = metrics.width;
        const textHeight = localTextState.fontSize;

        // Hit testing
        const left = localTextState.x - textWidth / 2;
        const right = localTextState.x + textWidth / 2;
        const top = localTextState.y - textHeight / 2;
        const bottom = localTextState.y + textHeight / 2;

        if (clickX >= left && clickX <= right && clickY >= top && clickY <= bottom) {
            setIsDragging(true);
            setDragOffset({
                x: clickX - localTextState.x,
                y: clickY - localTextState.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;

        // Update local state only
        setLocalTextState(prev => ({
            ...prev,
            x: currentX - dragOffset.x,
            y: currentY - dragOffset.y
        }));
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            onTextUpdate(localTextState);
        }
    };

    return (
        <div ref={containerRef} className="flex-1 flex items-center justify-center p-8 bg-black/50 overflow-hidden">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-w-full max-h-full shadow-2xl shadow-black border border-gray-800"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
        </div>
    );
});

LayerCanvas.displayName = 'LayerCanvas';

export default LayerCanvas;
