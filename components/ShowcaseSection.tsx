'use client';

import React from 'react';
import Image from 'next/image';

const examples = [
    {
        src: '/images/example-travel.png',
        alt: 'Travel Vlog Thumbnail',
        badge: '감성 브이로그 썸네일',
        color: 'bg-orange-100 text-orange-700'
    },
    {
        src: '/images/example-fashion.png',
        alt: 'Magazine Cover Design',
        badge: '매거진 커버 디자인',
        color: 'bg-purple-100 text-purple-700'
    },
    {
        src: '/images/example-cinematic.png',
        alt: 'Cinematic Title',
        badge: '시네마틱 타이틀',
        color: 'bg-blue-100 text-blue-700'
    }
];

export default function ShowcaseSection() {
    return (
        <section className="bg-white py-16 md:py-24 w-full border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16 tracking-tight">
                    다양한 스타일을 1초 만에 완성하세요
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {examples.map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                                {/* Fallback box in case image is missing during dev, but using Next/Image as requested */}
                                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${item.color}`}>
                                {item.badge}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
