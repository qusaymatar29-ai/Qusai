
import React from 'react';
import { StyleOption } from '../types';
import { INTERIOR_STYLES } from '../constants';

interface StyleCarouselProps {
  selectedId: string | null;
  onSelect: (style: StyleOption) => void;
  disabled?: boolean;
}

const StyleCarousel: React.FC<StyleCarouselProps> = ({ selectedId, onSelect, disabled }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-gray-300"></span>
        Choose a Style
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-2 px-2">
        {INTERIOR_STYLES.map((style) => (
          <button
            key={style.id}
            disabled={disabled}
            onClick={() => onSelect(style)}
            className={`
              flex-shrink-0 w-40 group transition-all duration-300 text-left
              ${selectedId === style.id ? 'opacity-100 scale-100' : 'opacity-70 hover:opacity-100'}
              ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'}
            `}
          >
            <div className={`
              relative aspect-[4/5] rounded-xl overflow-hidden mb-2 transition-all border-2
              ${selectedId === style.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg' : 'border-transparent shadow-sm'}
            `}>
              <img src={style.thumbnail} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <p className="text-sm font-bold leading-tight">{style.name}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight px-1">
              {style.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleCarousel;
