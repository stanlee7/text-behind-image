import { UploadCloud } from 'lucide-react';
import React, { useCallback } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onImageSelect(e.dataTransfer.files[0]);
            }
        },
        [onImageSelect]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-200">Drag & Drop Image Here</p>
            <p className="text-sm text-gray-500 mt-2">or click to upload</p>
        </div>
    );
}
