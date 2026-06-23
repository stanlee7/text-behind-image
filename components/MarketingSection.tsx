'use client';

import React from 'react';
import { FaBolt, FaInfinity, FaShieldAlt } from 'react-icons/fa'; // Using FontAwesome icons from react-icons
import Reveal from './Reveal';

const features = [
    {
        icon: <FaBolt className="w-8 h-8 text-blue-600" />,
        iconBg: 'bg-blue-50',
        title: '0.1초 자동 누끼',
        desc: '복잡한 펜툴 작업은 잊으세요. 업로드하는 즉시 AI가 피사체를 완벽하게 인식해 분리합니다.',
    },
    {
        icon: <FaInfinity className="w-8 h-8 text-indigo-600" />,
        iconBg: 'bg-indigo-50',
        title: '100% 무료 & 무제한',
        desc: '회원가입도, 구독료도 없습니다. 원하는 만큼 마음껏 만들고 고화질로 다운로드하세요.',
    },
    {
        icon: <FaShieldAlt className="w-8 h-8 text-green-600" />,
        iconBg: 'bg-green-50',
        title: '개인정보 완벽 보호',
        desc: '이미지가 서버에 영구 별도 저장되지 않고 처리 직후 파기됩니다. 안심하고 사용하세요.',
    },
];

export default function MarketingSection() {
    return (
        <section className="bg-gray-50 py-20 md:py-28 text-gray-900 w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((f, index) => (
                        <Reveal key={index} delay={index * 120}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-start gap-4 h-full">
                                <div className={`p-3 ${f.iconBg} rounded-xl`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold">{f.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
