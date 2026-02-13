
import React, { useState, useRef, useEffect } from 'react';

interface CompareSliderProps {
  original: string;
  generated: string;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ original, generated }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize group shadow-2xl bg-gray-100"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Generated Image (Base) */}
      <img 
        src={generated} 
        alt="Redesigned Room" 
        className="absolute inset-0 w-full h-full object-cover select-none"
      />
      
      {/* Original Image (Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={original} 
          alt="Original Room" 
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
        />
      </div>

      {/* Slider Bar */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center -ml-0.5 border-4 border-gray-100">
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 4m0 0l4 4m-4-4h18m-4 4l4-4m0 0l-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold pointer-events-none">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold pointer-events-none">
        Redesign
      </div>
    </div>
  );
};

export default CompareSlider;
