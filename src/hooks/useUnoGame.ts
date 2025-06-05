import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Card, CardColor } from '../types/game';
import { createDeck, canPlayCard, shuffleDeck } from '../utils/cardUtils';

export const useUnoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    direction: 1,
    gameStarted: false,
    winner: null,
  });

  const [showColorSelector, setShowColorSelector] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<Card | null>(null);

  const startGame = useCallback((playerName: string, botCount: number) => {
    const deck = createDeck();
    const players: Player[] = [
      { id: 'human', name: playerName, cards: [], isBot: false }
    ];

    // Add bots
    for (let i = 1; i <= botCount; i++) {
      players.push({
        id: `bot-${i}`,
        name: `Bot ${i}`,
        cards: [],
        isBot: true
      });
    }

    // Deal 7 cards to each player
    let deckIndex = 0;
    players.forEach(player => {
      player.cards = deck.slice(deckIndex, deckIndex + 7);
      deckIndex += 7;
    });

    // Find first non-wild card for discard pile
    let firstCard = deck[deckIndex];
    while (firstCard.type === 'wild' || firstCard.type === 'wild4') {
      deckIndex++;
      firstCard = deck[deckIndex];
    }

    const remainingDeck = deck.slice(deckIndex + 1);
    const discardPile = [firstCard];

    setGameState({
      players,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      discardPile,
      direction: 1,
      gameStarted: true,
      winner: null,
    });
  }, []);

  const drawCard = useCallback(() => {
    setGameState(prev => {
      if (prev.deck.length === 0) return prev;

      const newCard = prev.deck[0];
      const newDeck = prev.deck.slice(1);
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].cards.push(newCard);

      return {
        ...prev,
        players: newPlayers,
        deck: newDeck,
      };
    });
  }, []);

  const nextPlayer = useCallback((skipCount = 1) => {
    setGameState(prev => {
      const playerCount = prev.players.length;
      let nextIndex = prev.currentPlayerIndex;
      
      for (let i = 0; i < skipCount; i++) {
        nextIndex = (nextIndex + prev.direction + playerCount) % playerCount;
      }

      return {
        ...prev,
        currentPlayerIndex: nextIndex,
      };
    });
  }, []);

  const playCard = useCallback((card: Card, selectedColor?: CardColor) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      const currentPlayer = newPlayers[prev.currentPlayerIndex];
      
      // Remove card from player's hand
      currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== card.id);
      
      // Add card to discard pile
      const newDiscardPile = [...prev.discardPile, card];
      
      let newDirection = prev.direction;
      let skipCount = 1;
      let drawCards = 0;

      // Handle special cards
      switch (card.type) {
        case 'reverse':
          newDirection = prev.direction * -1;
          break;
        case 'skip':
          skipCount = 2;
          break;
        case 'draw2':
          drawCards = 2;
          skipCount = 2;
          break;
        case 'wild4':
          drawCards = 4;
          skipCount = 2;
          break;
      }

      // Draw cards for next player if needed
      if (drawCards > 0) {
        const nextPlayerIndex = (prev.currentPlayerIndex + newDirection + prev.players.length) % prev.players.length;
        const cardsToGive = prev.deck.slice(0, drawCards);
        newPlayers[nextPlayerIndex].cards.push(...cardsToGive);
        
        return {
          ...prev,
          players: newPlayers,
          deck: prev.deck.slice(drawCards),
          discardPile: newDiscardPile,
          direction: newDirection,
          selectedColor,
          currentPlayerIndex: (prev.currentPlayerIndex + newDirection * skipCount + prev.players.length) % prev.players.length,
        };
      }

      // Check for winner
      if (currentPlayer.cards.length === 0) {
        return {
          ...prev,
          players: newPlayers,
          discardPile: newDiscardPile,
          winner: currentPlayer,
        };
      }

      return {
        ...prev,
        players: newPlayers,
        discardPile: newDiscardPile,
        direction: newDirection,
        selectedColor,
        currentPlayerIndex: (prev.currentPlayerIndex + newDirection * skipCount + prev.players.length) % prev.players.length,
      };
    });
  }, []);

  const handleCardPlay = useCallback((card: Card) => {
    if (card.type === 'wild' || card.type === 'wild4') {
      setPendingWildCard(card);
      setShowColorSelector(true);
    } else {
      playCard(card);
    }
  }, [playCard]);

  const handleColorSelect = useCallback((color: CardColor) => {
    if (pendingWildCard) {
      playCard(pendingWildCard, color);
      setPendingWildCard(null);
    }
    setShowColorSelector(false);
  }, [pendingWildCard, playCard]);

  const getPlayableCards = useCallback((playerCards: Card[]) => {
    if (gameState.discardPile.length === 0) return [];
    
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    return playerCards.filter(card => canPlayCard(card, topCard, gameState.selectedColor));
  }, [gameState.discardPile, gameState.selectedColor]);

  // Bot AI
  useEffect(() => {
    if (!gameState.gameStarted || gameState.winner) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const playableCards = getPlayableCards(currentPlayer.cards);
      
      if (playableCards.length > 0) {
        // Simple AI: play first playable card
        const cardToPlay = playableCards[0];
        
        if (cardToPlay.type === 'wild' || cardToPlay.type === 'wild4') {
          // Choose most common color in hand
          const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
          currentPlayer.cards.forEach(card => {
            if (card.color !== 'wild') {
              colorCounts[card.color]++;
            }
          });
          
          const bestColor = Object.entries(colorCounts).reduce((a, b) => 
            colorCounts[a[0]] > colorCounts[b[0]] ? a : b
          )[0] as CardColor;
          
          playCard(cardToPlay, bestColor);
        } else {
          playCard(cardToPlay);
        }
      } else {
        // Draw a card
        drawCard();
        // Move to next player after drawing
        setTimeout(() => nextPlayer(), 500);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [gameState.currentPlayerIndex, gameState.gameStarted, gameState.winner, getPlayableCards, playCard, drawCard, nextPlayer]);

  return {
    gameState,
    showColorSelector,
    startGame,
    handleCardPlay,
    handleColorSelect,
    drawCard,
    nextPlayer,
    getPlayableCards,
  };
};
