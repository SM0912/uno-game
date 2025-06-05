import React, { useState } from 'react';
import { Users, Bot, Play } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (playerName: string, botCount: number) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [botCount, setBotCount] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onStartGame(playerName.trim(), botCount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">UNO</h1>
          <p className="text-gray-600">The classic card game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Users className="w-5 h-5" />
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Bot className="w-5 h-5" />
              Number of Bots
            </label>
            <select
              value={botCount}
              onChange={(e) => setBotCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value={1}>1 Bot</option>
              <option value={2}>2 Bots</option>
              <option value={3}>3 Bots</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            Start Game
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Match colors, numbers, or play action cards!</p>
          <p>First to empty your hand wins!</p>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
