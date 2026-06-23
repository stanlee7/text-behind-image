'use client';

import React from 'react';
import Link from 'next/link';
import { FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

const navLinks = [
    { href: '/about', label: '소개' },
    { href: '/guide', label: '사용 가이드' },
    { href: '/faq', label: '자주 묻는 질문' },
    { href: '/privacy', label: '개인정보처리방침' },
    { href: '/terms', label: '이용약관' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-white py-14 w-full">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="w-full border-t border-gray-800" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                    <div className="text-sm text-gray-400 font-medium">
                        © 2026 Nukki Text. All rights reserved. Created by Stanlee Tam.
                    </div>

                    <div className="flex items-center gap-6">
                    <a
                        href="https://www.youtube.com/@stanleestudio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110"
                    >
                        <FaYoutube className="w-6 h-6" />
                    </a>
                    <a
                        href="https://www.instagram.com/stanleestudio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors transform hover:scale-110"
                    >
                        <FaInstagram className="w-6 h-6" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/stanlee-tam-49774a238/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                    >
                        <FaLinkedin className="w-6 h-6" />
                    </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
