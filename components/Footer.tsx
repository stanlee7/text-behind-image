'use client';

import React from 'react';
import { FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-white py-14 w-full">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
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
        </footer>
    );
}
