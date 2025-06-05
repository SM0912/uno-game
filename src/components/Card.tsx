import React from 'react';
import { Card as CardType } from '../types/game';
import { getCardDisplayText, getCardColor } from '../utils/cardUtils';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  selectedColor?: string;
  size?: 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  isPlayable = false, 
  selectedColor,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-16 h-24 text-sm',
    large: 'w-20 h-28 text-base'
  };

  const colorClass = getCardColor(card, selectedColor);
  const displayText = getCardDisplayText(card);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClass}
        ${isPlayable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-default'}
        ${isPlayable ? 'ring-2 ring-white ring-opacity-50' : ''}
        rounded-lg border-2 border-white
        flex items-center justify-center
        font-bold text-white
        transition-all duration-200
        shadow-md
        select-none
      `}
      onClick={onClick}
    >
      <span className="drop-shadow-sm">{displayText}</span>
    </div>
  );
};

export default Card;
