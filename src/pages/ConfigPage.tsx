import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, RefreshCw, Code, Book, Map, PenTool as Tool, Bot, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

export default function ConfigPage() {
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { goals, zones, skills, tools, aiNodes, currentWorld, currentGoal } = useGameData(playerState.selectedGoalId);

  const handleGoalSelect = (goalId: string) => {
    actions.setGoal(goalId);
  };

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
        <p className="text-gray-600">Manage game settings and world structure</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {/* Goal Selector */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-interface mb-6">Available Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`p-4 rounded-lg border-2 transition ${
                  playerState.selectedGoalId === goal.id
                    ? 'border-dream-primary bg-dream-primary/10'
                    : 'border-gray-200 hover:border-dream-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="text-left">
                    <h3 className="font-interface font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* World Summary */}
        {playerState.selectedGoalId && (
          <section className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-interface mb-6">World Configuration Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-dream-primary" />
                  <div>
                    <h3 className="font-medium">Zones</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>{zones?.length || 0} explorable areas</p>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        {zones?.map(zone => (
                          <li key={zone.id}>
                            {zone.name}: {zone.gridSize[0]}x{zone.gridSize[1]} grid
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-dream-primary" />
                  <div>
                    <h3 className="font-medium">Missions</h3>
                    <p className="text-sm text-gray-600">
                      {zones?.reduce((acc, zone) => acc + zone.missions.length, 0) || 0} restoration tasks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Book className="w-5 h-5 text-dream-primary" />
                  <div>
                    <h3 className="font-medium">Skills</h3>
                    <p className="text-sm text-gray-600">
                      {skills?.length || 0} learnable abilities
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tool className="w-5 h-5 text-dream-primary" />
                  <div>
                    <h3 className="font-medium">Tools</h3>
                    <p className="text-sm text-gray-600">
                      {tools?.length || 0} collectible items for restoration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-dream-primary" />
                  <div>
                    <h3 className="font-medium">AI Nodes</h3>
                    <p className="text-sm text-gray-600">
                      {aiNodes?.length || 0} AI partners for guidance and training
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-2xl flex items-center justify-center">🌍</div>
                  <div>
                    <h3 className="font-medium">World Themes</h3>
                    <p className="text-sm text-gray-600">
                      {currentWorld?.worldPrompt.worldThemes.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-dream-zone-bg rounded-lg">
              <h3 className="font-medium mb-2">World Philosophy</h3>
              <p className="text-sm text-gray-600 italic">
                {currentGoal?.worldPhilosophy}
              </p>
            </div>
          </section>
        )}

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