import React from 'react';
import { CardColor } from '../types/game';

interface ColorSelectorProps {
  onColorSelect: (color: CardColor) => void;
  isVisible: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ onColorSelect, isVisible }) => {
  if (!isVisible) return null;

  const colors: { color: CardColor; bg: string; name: string }[] = [
    { color: 'red', bg: 'bg-red-500', name: 'Red' },
    { color: 'blue', bg: 'bg-blue-500', name: 'Blue' },
    { color: 'green', bg: 'bg-green-500', name: 'Green' },
    { color: 'yellow', bg: 'bg-yellow-500', name: 'Yellow' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-center mb-4">Choose a Color</h3>
        <div className="grid grid-cols-2 gap-4">
          {colors.map(({ color, bg, name }) => (
            <button
              key={color}
              className={`
                ${bg} text-white font-bold py-4 px-6 rounded-lg
                hover:scale-105 transition-transform duration-200
                shadow-lg hover:shadow-xl
              `}
              onClick={() => onColorSelect(color)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
