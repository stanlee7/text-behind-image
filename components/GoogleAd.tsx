'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface GoogleAdProps {
    slot: string;
    style?: React.CSSProperties;
    className?: string;
    format?: string; // 'auto', 'fluid', etc.
    layout?: string; // 'in-article', etc.
    responsive?: boolean;
}

export default function GoogleAd({
    slot,
    style = { display: 'block' },
    className = '',
    format = 'auto',
    layout,
    responsive = true,
}: GoogleAdProps) {
    const pathname = usePathname();
    // Check if we are in production mode
    const isProduction = process.env.NODE_ENV === 'production';
    // You can also use a specific environment variable like NEXT_PUBLIC_ENABLE_ADS

    useEffect(() => {
        // Only execute AdSense script logic in production to prevent invalid traffic markings during dev
        if (isProduction) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('Google AdSense push error:', err);
            }
        }
    }, [pathname, isProduction, slot]); // Re-run if path or slot changes

    // Development Placeholder
    if (!isProduction) {
        return (
            <div
                className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 overflow-hidden ${className}`}
                style={{ ...style, minHeight: style.height || '200px', minWidth: '100%' }}
            >
                <p className="font-bold text-sm">광고 영역 (ID: {slot})</p>
                <p className="text-xs">Format: {format}</p>
            </div>
        );
    }

    return (
        <div className={className} aria-hidden={true}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-3338008832521664"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
                data-ad-layout={layout}
            />
        </div>
    );
}
