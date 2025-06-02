import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, RefreshCw, Code, Book, Map, PenTool as Tool, Bot, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';
import { Goal } from '../services/GameDataService';

// Separate component for displaying goal details in config
function GoalDetailsCard({ goal }: { goal: Goal }) {
  const { zones, skills, tools, aiNodes } = useGameData(goal.id);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-start gap-4 mb-4">
        <div className={`${goal.themeColor} p-3 rounded-lg text-white text-2xl`}>
          {goal.icon}
        </div>
        <div>
          <h3 className="text-xl font-interface font-medium">{goal.title}</h3>
          <p className="text-sm text-gray-600">{goal.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-dream-primary" />
          <div>
            <h4 className="font-medium">Zones</h4>
            <p className="text-sm text-gray-600">{zones?.length || 0} explorable areas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-dream-primary" />
          <div>
            <h4 className="font-medium">Missions</h4>
            <p className="text-sm text-gray-600">
              {zones?.reduce((acc, zone) => acc + zone.missions.length, 0) || 0} restoration tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Book className="w-5 h-5 text-dream-primary" />
          <div>
            <h4 className="font-medium">Skills</h4>
            <p className="text-sm text-gray-600">{skills?.length || 0} learnable abilities</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tool className="w-5 h-5 text-dream-primary" />
          <div>
            <h4 className="font-medium">Tools</h4>
            <p className="text-sm text-gray-600">{tools?.length || 0} collectible items</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-dream-primary" />
          <div>
            <h4 className="font-medium">AI Nodes</h4>
            <p className="text-sm text-gray-600">{aiNodes?.length || 0} AI partners</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-dream-zone-bg rounded-lg">
        <p className="text-sm text-gray-600 italic">{goal.worldPhilosophy}</p>
      </div>
    </div>
  );
}

export default function ConfigPage() {
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { goals } = useGameData();

  const handleReset = () => {
    actions.resetState();
    navigate('/choose-goal');
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">Game Configuration</h1>
        </div>
        <p className="text-gray-600">View game settings and world structure</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {/* Goal Details */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-interface mb-6">Available Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalDetailsCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>

        {/* Reset Button */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-interface mb-2">Reset Game</h2>
              <p className="text-gray-600">Clear all progress and start fresh</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-dream-contrast hover:bg-dream-contrast/90 text-white px-4 py-2 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
              Reset Game
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}