'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    /** Delay in ms before the reveal animation starts (for staggering). */
    delay?: number;
    className?: string;
}

/**
 * Fades + slides its children up the first time they scroll into view.
 * Uses IntersectionObserver; gracefully shows content immediately if
 * the API is unavailable (SSR / older browsers).
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            const id = setTimeout(() => setVisible(true), 0);
            return () => clearTimeout(id);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out motion-reduce:transition-none ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
