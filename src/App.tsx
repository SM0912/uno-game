import React from 'react';
import { useUnoGame } from './hooks/useUnoGame';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import ColorSelector from './components/ColorSelector';
import { Trophy, RotateCcw } from 'lucide-react';

function App() {
  const {
    gameState,
    showColorSelector,
    startGame,
    handleCardPlay,
    handleColorSelect,
    drawCard,
    getPlayableCards,
  } = useUnoGame();

  if (!gameState.gameStarted) {
    return <GameSetup onStartGame={startGame} />;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players.find(p => !p.isBot);
  const botPlayers = gameState.players.filter(p => p.isBot);
  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  
  const playableCards = humanPlayer ? getPlayableCards(humanPlayer.cards) : [];
  const canDrawCard = currentPlayer && !currentPlayer.isBot && playableCards.length === 0;

  const handleNewGame = () => {
    window.location.reload();
  };

  if (gameState.winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h1>
          <p className="text-xl text-gray-600 mb-6">
            🎉 {gameState.winner.name} wins! 🎉
          </p>
          <button
            onClick={handleNewGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">UNO Game</h1>
          <p className="text-white opacity-90">
            Current Player: <span className="font-semibold">{currentPlayer.name}</span>
          </p>
        </div>

        {/* Bot Players */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {botPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`
                bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4
                ${gameState.currentPlayerIndex === gameState.players.indexOf(player) ? 'ring-4 ring-yellow-400' : ''}
              `}
            >
              <PlayerHand
                player={player}
                isCurrentPlayer={gameState.currentPlayerIndex === gameState.players.indexOf(player)}
                playableCards={[]}
                onCardPlay={() => {}}
                selectedColor={gameState.selectedColor}
              />
            </div>
          ))}
        </div>

        {/* Game Board */}
        <div className="mb-6">
          <GameBoard
            topCard={topCard}
            deckSize={gameState.deck.length}
            selectedColor={gameState.selectedColor}
            direction={gameState.direction}
            onDrawCard={drawCard}
            canDrawCard={canDrawCard}
          />
        </div>

        {/* Human Player */}
        {humanPlayer && (
          <div className={`
            bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6
            ${!currentPlayer.isBot ? 'ring-4 ring-yellow-400' : ''}
          `}>
            <PlayerHand
              player={humanPlayer}
              isCurrentPlayer={!currentPlayer.isBot}
              playableCards={playableCards}
              onCardPlay={handleCardPlay}
              selectedColor={gameState.selectedColor}
            />
          </div>
        )}

        {/* Game Info */}
        <div className="mt-6 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-white">
              Cards in deck: <span className="font-semibold">{gameState.deck.length}</span>
            </p>
            {canDrawCard && (
              <p className="text-yellow-300 font-semibold mt-2">
                No playable cards - click the deck to draw!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Color Selector Modal */}
      <ColorSelector
        isVisible={showColorSelector}
        onColorSelect={handleColorSelect}
      />
    </div>
  );
}

export default App;
