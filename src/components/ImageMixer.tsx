'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ImageMixer() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image1) {
      const url = URL.createObjectURL(image1);
      setPreview1(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview1(null);
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      const url = URL.createObjectURL(image2);
      setPreview2(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview2(null);
    }
  }, [image2]);

  useEffect(() => {
    return () => {
      if (resultImageUrl) {
        URL.revokeObjectURL(resultImageUrl);
      }
    };
  }, [resultImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Security/Robustness: Limit file size (e.g., 5MB) and validate type
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError('File is too large. Max size is 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      setError(null);
      setter(file);
    }
  };

  const handleGenerate = async () => {
    if (!image1 || !image2) return;

    setIsGenerating(true);
    setError(null);

    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;

    if (!webhookUrl) {
      setError('Configuration error: Webhook URL is not defined.');
      setIsGenerating(false);
      return;
    }

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const UploadZone = ({ 
    label, 
    preview, 
    onSelect, 
    inputRef 
  }: { 
    label: string, 
    preview: string | null, 
    onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement | null>
  }) => (
    <div 
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-gray-200 aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"
    >
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span className="text-xs font-medium uppercase tracking-widest">{label}</span>
        </div>
      )}
      <input 
        type="file" 
        className="hidden" 
        onChange={onSelect} 
        ref={inputRef}
        accept="image/*"
      />
      {preview && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-gray-400 text-sm">INICIO</span>
        <span className="text-gray-300 text-xs">/</span>
        <span className="text-black text-sm font-bold uppercase tracking-wider">Image Mixer</span>
      </div>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">MIXER</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-8">
          <UploadZone 
            label="Image 1" 
            preview={preview1} 
            onSelect={(e) => handleFileChange(e, setImage1)} 
            inputRef={fileInputRef1}
          />
          <UploadZone 
            label="Image 2" 
            preview={preview2} 
            onSelect={(e) => handleFileChange(e, setImage2)} 
            inputRef={fileInputRef2}
          />
          
          <button 
            onClick={handleGenerate}
            disabled={!image1 || !image2 || isGenerating}
            className="w-full border-2 border-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
          >
            {isGenerating ? 'Processing...' : 'GENERATE'}
          </button>

          {error && (
            <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-4">
              Error: {error}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="border border-gray-100 aspect-[16/9] md:aspect-auto md:h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
            {resultImageUrl ? (
              <img src={resultImageUrl} alt="Result" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center px-8">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Creating your image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span className="text-sm font-medium uppercase tracking-widest">Result will appear here</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}