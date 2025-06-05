import { Card, CardColor, CardType } from '../types/game';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  // Number cards (0-9)
  colors.forEach(color => {
    // One 0 card per color
    deck.push({
      id: `${color}-0-${Math.random()}`,
      color,
      type: 'number',
      value: 0
    });
    
    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 2; j++) {
        deck.push({
          id: `${color}-${i}-${j}-${Math.random()}`,
          color,
          type: 'number',
          value: i
        });
      }
    }
    
    // Action cards (2 of each per color)
    const actions: CardType[] = ['skip', 'reverse', 'draw2'];
    actions.forEach(action => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: `${color}-${action}-${i}-${Math.random()}`,
          color,
          type: action
        });
      }
    });
  });
  
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild'
    });
    
    deck.push({
      id: `wild4-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild4'
    });
  }
  
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const canPlayCard = (card: Card, topCard: Card, selectedColor?: CardColor): boolean => {
  if (card.type === 'wild' || card.type === 'wild4') {
    return true;
  }
  
  if (topCard.type === 'wild' || topCard.type === 'wild4') {
    return selectedColor ? card.color === selectedColor : true;
  }
  
  return card.color === topCard.color || 
         card.type === topCard.type || 
         (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value);
};

export const getCardDisplayText = (card: Card): string => {
  switch (card.type) {
    case 'number':
      return card.value?.toString() || '0';
    case 'skip':
      return '⊘';
    case 'reverse':
      return '⟲';
    case 'draw2':
      return '+2';
    case 'wild':
      return 'W';
    case 'wild4':
      return '+4';
    default:
      return '';
  }
};

export const getCardColor = (card: Card, selectedColor?: CardColor): string => {
  if (card.type === 'wild' || card.type === 'wild4') {
    if (selectedColor) {
      switch (selectedColor) {
        case 'red': return 'bg-red-500';
        case 'blue': return 'bg-blue-500';
        case 'green': return 'bg-green-500';
        case 'yellow': return 'bg-yellow-500';
        default: return 'bg-gray-800';
      }
    }
    return 'bg-gray-800';
  }
  
  switch (card.color) {
    case 'red': return 'bg-red-500';
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};
