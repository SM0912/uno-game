import React from 'react';
import { Card as CardType, CardColor } from '../types/game';
import Card from './Card';
import { Shuffle, RotateCcw } from 'lucide-react';

interface GameBoardProps {
  topCard: CardType;
  deckSize: number;
  selectedColor?: CardColor;
  direction: 1 | -1;
  onDrawCard: () => void;
  canDrawCard: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  topCard,
  deckSize,
  selectedColor,
  direction,
  onDrawCard,
  canDrawCard
}) => {
  return (
    <div className="flex items-center justify-center gap-8 p-8 bg-green-600 rounded-xl shadow-lg">
      {/* Draw Pile */}
      <div className="flex flex-col items-center">
        <h4 className="text-white font-semibold mb-2">Draw Pile</h4>
        <div
          className={`
            w-20 h-28 bg-blue-900 rounded-lg border-2 border-white
            flex items-center justify-center cursor-pointer
            hover:scale-105 transition-transform duration-200
            shadow-lg
            ${canDrawCard ? 'ring-2 ring-yellow-400' : ''}
          `}
          onClick={canDrawCard ? onDrawCard : undefined}
        >
          <Shuffle className="text-white w-8 h-8" />
        </div>
        <p className="text-white text-sm mt-1">{deckSize} cards</p>
      </div>

      {/* Direction Indicator */}
      <div className="flex flex-col items-center">
        <h4 className="text-white font-semibold mb-2">Direction</h4>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
          <RotateCcw 
            className={`w-8 h-8 text-green-600 ${direction === -1 ? 'transform scale-x-[-1]' : ''}`} 
          />
        </div>
        <p className="text-white text-sm mt-1">
          {direction === 1 ? 'Clockwise' : 'Counter-clockwise'}
        </p>
      </div>

      {/* Discard Pile */}
      <div className="flex flex-col items-center">
        <h4 className="text-white font-semibold mb-2">Discard Pile</h4>
        <Card 
          card={topCard} 
          selectedColor={selectedColor}
          size="large"
        />
        {selectedColor && (topCard.type === 'wild' || topCard.type === 'wild4') && (
          <p className="text-white text-sm mt-1 capitalize">Color: {selectedColor}</p>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
