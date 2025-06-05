import React from 'react';
import { Player, Card as CardType } from '../types/game';
import Card from './Card';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer: boolean;
  playableCards: CardType[];
  onCardPlay: (card: CardType) => void;
  selectedColor?: string;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentPlayer,
  playableCards,
  onCardPlay,
  selectedColor
}) => {
  const isCardPlayable = (card: CardType) => {
    return playableCards.some(playableCard => playableCard.id === card.id);
  };

  if (player.isBot) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{player.name}</h3>
        <div className="flex flex-wrap gap-1 justify-center">
          {player.cards.map((_, index) => (
            <div
              key={index}
              className="w-12 h-16 bg-blue-900 rounded-lg border-2 border-white shadow-md"
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">{player.cards.length} cards</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {player.name} {isCurrentPlayer && '(Your Turn)'}
      </h3>
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
        {player.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => isCurrentPlayer && isCardPlayable(card) && onCardPlay(card)}
            isPlayable={isCurrentPlayer && isCardPlayable(card)}
            selectedColor={selectedColor}
            size="medium"
          />
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-1">{player.cards.length} cards</p>
    </div>
  );
};

export default PlayerHand;
