import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Sparkles } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-narrative mb-4">Welcome to The Dream</h1>
          <p className="text-gray-600">A gentle, narrative-driven restoration game</p>
        </header>

        <main className="space-y-12">
          <section className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Leaf className="w-8 h-8 text-dream-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-narrative mb-3">The Game</h2>
                <p className="text-gray-600 mb-4">
                  The Dream is a narrative restoration game where players partner with AI Nodes 
                  to heal a broken world. Through exploration, skill development, and intentional 
                  choices, players regenerate damaged ecosystems and rebuild trust in human-AI 
                  collaboration.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Sparkles className="w-8 h-8 text-dream-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-narrative mb-3">Gameplay</h2>
                <p className="text-gray-600 mb-4">
                  Players select a life goal, navigate zones, collect tools, train skills, and 
                  resolve events. Every completed mission contributes Harmony points toward the 
                  global healing effort. Zones evolve visually from Damaged → Healing → Restored, 
                  showing the player's impact.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8">
            <button
              onClick={() => navigate('/choose-goal')}
              className="bg-dream-primary hover:bg-dream-primary-hover text-white px-8 py-3 rounded-lg transition text-lg font-interface"
            >
              Start New Game
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}