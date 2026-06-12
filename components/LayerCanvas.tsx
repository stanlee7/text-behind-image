import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { TextLayer } from '@/utils/text';

interface LayerCanvasProps {
    originalImageUrl: string | null;
    foregroundImageUrl: string | null;
    layers: TextLayer[];
    selectedLayerId: string | null;
    onSelectLayer: (id: string) => void;
    onLayerUpdate: (id: string, patch: Partial<TextLayer>) => void;
}

export interface LayerCanvasHandle {
    download: () => void;
}

const LINE_HEIGHT = 1.2;

// Resolve var(--font-name) to the actual font family via getComputedStyle
const resolveFontFamily = (fontFamily: string): string => {
    if (fontFamily.startsWith('var(')) {
        const varName = fontFamily.match(/var\(([^)]+)\)/)?.[1];
        if (varName) {
            const computed = getComputedStyle(document.body).getPropertyValue(varName).trim();
            if (computed) return computed.replace(/"/g, '');
        }
        return 'sans-serif';
    }
    return fontFamily;
};

const applyTextStyle = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
    const family = resolveFontFamily(layer.fontFamily) || 'sans-serif';
    ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${family}`;
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${layer.letterSpacing}px`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
};

const measureLayer = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
    ctx.save();
    applyTextStyle(ctx, layer);
    const lines = layer.content.split('\n');
    let width = 0;
    for (const line of lines) {
        width = Math.max(width, ctx.measureText(line).width);
    }
    ctx.restore();
    const lineHeight = layer.fontSize * LINE_HEIGHT;
    return { width, height: lineHeight * lines.length };
};

const drawLayer = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
    if (!layer.content) return;
    ctx.save();
    ctx.translate(layer.x, layer.y);
    if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity / 100));
    applyTextStyle(ctx, layer);
    if (layer.shadowBlur > 0) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = layer.shadowBlur;
    }
    const lines = layer.content.split('\n');
    const lineHeight = layer.fontSize * LINE_HEIGHT;
    lines.forEach((line, i) => {
        const yOffset = (i - (lines.length - 1) / 2) * lineHeight;
        if (layer.strokeWidth > 0) {
            ctx.lineWidth = layer.strokeWidth;
            ctx.strokeStyle = layer.strokeColor;
            ctx.lineJoin = 'round';
            ctx.strokeText(line, 0, yOffset);
        }
        ctx.fillStyle = layer.color;
        ctx.fillText(line, 0, yOffset);
    });
    ctx.restore();
};

// Hit test in the layer's rotated local space; topmost layer wins
const hitTestLayers = (
    ctx: CanvasRenderingContext2D,
    layers: TextLayer[],
    x: number,
    y: number
): string | null => {
    const reversed = [...layers].reverse();
    const ordered = [...reversed.filter(l => !l.isBehind), ...reversed.filter(l => l.isBehind)];
    for (const layer of ordered) {
        if (!layer.content) continue;
        const { width, height } = measureLayer(ctx, layer);
        const rad = (-(layer.rotation || 0) * Math.PI) / 180;
        const dx = x - layer.x;
        const dy = y - layer.y;
        const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
        const pad = 12;
        if (Math.abs(lx) <= width / 2 + pad && Math.abs(ly) <= height / 2 + pad) {
            return layer.id;
        }
    }
    return null;
};

const LayerCanvas = forwardRef<LayerCanvasHandle, LayerCanvasProps>(({
    originalImageUrl,
    foregroundImageUrl,
    layers,
    selectedLayerId,
    onSelectLayer,
    onLayerUpdate,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Local state for smooth dragging without parent re-renders
    const [localLayers, setLocalLayers] = useState<TextLayer[]>(layers);
    const [images, setImages] = useState<{ bg: HTMLImageElement | null; fg: HTMLImageElement | null }>({
        bg: null,
        fg: null,
    });

    const [dragId, setDragId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [fontTick, setFontTick] = useState(0);

    // Sync props to local state when not dragging
    useEffect(() => {
        if (!dragId) {
            setLocalLayers(layers);
        }
    }, [layers, dragId]);

    // Load images
    useEffect(() => {
        if (originalImageUrl) {
            const bgImg = new Image();
            bgImg.src = originalImageUrl;
            bgImg.onload = () => setImages(prev => ({ ...prev, bg: bgImg }));
        } else {
            setImages(prev => ({ ...prev, bg: null }));
        }

        if (foregroundImageUrl) {
            const fgImg = new Image();
            fgImg.src = foregroundImageUrl;
            fgImg.onload = () => setImages(prev => ({ ...prev, fg: fgImg }));
        } else {
            setImages(prev => ({ ...prev, fg: null }));
        }
    }, [originalImageUrl, foregroundImageUrl]);

    // Ensure web fonts used by layers are actually loaded, then trigger a redraw.
    // Canvas drawing does not trigger font downloads by itself.
    const fontKey = localLayers.map(l => `${l.fontFamily}|${l.fontWeight}|${l.content}`).join('||');
    useEffect(() => {
        if (typeof document === 'undefined' || !document.fonts) return;
        let cancelled = false;
        Promise.all(
            localLayers.map(l => {
                const family = resolveFontFamily(l.fontFamily) || 'sans-serif';
                return document.fonts.load(`${l.fontWeight} 16px ${family}`, l.content).catch(() => []);
            })
        ).then(() => {
            if (!cancelled) setFontTick(t => t + 1);
        });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontKey]);

    const drawScene = (showSelection: boolean) => {
        const canvas = canvasRef.current;
        if (!canvas || !images.bg) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (canvas.width !== images.bg.width || canvas.height !== images.bg.height) {
            canvas.width = images.bg.width;
            canvas.height = images.bg.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // BG -> behind texts -> FG -> front texts
        ctx.drawImage(images.bg, 0, 0);
        localLayers.filter(l => l.isBehind).forEach(l => drawLayer(ctx, l));
        if (images.fg) ctx.drawImage(images.fg, 0, 0);
        localLayers.filter(l => !l.isBehind).forEach(l => drawLayer(ctx, l));

        if (showSelection && selectedLayerId) {
            const layer = localLayers.find(l => l.id === selectedLayerId);
            if (layer && layer.content) {
                const { width, height } = measureLayer(ctx, layer);
                const pad = Math.max(8, layer.fontSize * 0.15);
                ctx.save();
                ctx.translate(layer.x, layer.y);
                if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
                const lw = Math.max(2, canvas.width / 600);
                ctx.lineWidth = lw;
                ctx.strokeStyle = 'rgba(96, 165, 250, 0.9)';
                ctx.setLineDash([lw * 4, lw * 3]);
                ctx.strokeRect(-width / 2 - pad, -height / 2 - pad, width + pad * 2, height + pad * 2);
                ctx.restore();
            }
        }
    };

    useImperativeHandle(ref, () => ({
        download: () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Re-render without the selection box so it never appears in the export
            drawScene(false);
            const link = document.createElement('a');
            link.download = 'nukki-text.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            drawScene(true);
        }
    }));

    // Draw on every relevant change
    useEffect(() => {
        drawScene(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images, localLayers, selectedLayerId, fontTick]);

    const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height),
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pt = getCanvasPoint(e);
        const hitId = hitTestLayers(ctx, localLayers, pt.x, pt.y);
        if (hitId) {
            const layer = localLayers.find(l => l.id === hitId)!;
            onSelectLayer(hitId);
            setDragId(hitId);
            setDragOffset({ x: pt.x - layer.x, y: pt.y - layer.y });
            canvas.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!dragId) return;
        const pt = getCanvasPoint(e);
        setLocalLayers(prev => prev.map(l =>
            l.id === dragId
                ? { ...l, x: pt.x - dragOffset.x, y: pt.y - dragOffset.y }
                : l
        ));
    };

    const handlePointerUp = () => {
        if (!dragId) return;
        const layer = localLayers.find(l => l.id === dragId);
        setDragId(null);
        if (layer) {
            onLayerUpdate(layer.id, { x: layer.x, y: layer.y });
        }
    };

    return (
        <div ref={containerRef} className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black/50 overflow-hidden min-h-[300px] md:min-h-0">
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="max-w-full max-h-full shadow-2xl shadow-black border border-gray-800 touch-none"
                style={{ cursor: dragId ? 'grabbing' : 'grab' }}
            />
        </div>
    );
});

LayerCanvas.displayName = 'LayerCanvas';

export default LayerCanvas;
