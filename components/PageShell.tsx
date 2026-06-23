import React from 'react';
import Link from 'next/link';
import Footer from './Footer';

interface PageShellProps {
    title: string;
    description?: string;
    /** ISO date string shown as "최종 업데이트". Optional. */
    updatedAt?: string;
    children: React.ReactNode;
}

/**
 * Shared layout for content/legal pages (about, guide, faq, privacy, terms).
 * Provides a simple header that links back to the editor, a readable light
 * article container, and the global footer.
 */
export default function PageShell({ title, description, updatedAt, children }: PageShellProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 font-[family-name:var(--font-noto-sans-kr)]">
            <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 bg-white/90 backdrop-blur sticky top-0 z-30">
                <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900 hover:opacity-70 transition-opacity">
                    누끼 텍스트
                </Link>
                <Link
                    href="/"
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    편집기로 이동
                </Link>
            </header>

            <main className="flex-grow w-full">
                <article className="max-w-3xl mx-auto px-6 py-14 md:py-20">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-4 text-lg text-gray-600 leading-relaxed break-keep">{description}</p>
                    )}
                    {updatedAt && (
                        <p className="mt-3 text-sm text-gray-400">최종 업데이트: {updatedAt}</p>
                    )}
                    <div className="mt-10 space-y-8 text-[15px] md:text-base leading-[1.85] text-gray-700 break-keep [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_strong]:text-gray-900">
                        {children}
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
