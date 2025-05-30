import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

export default function GoalSelectionPage() {
  const navigate = useNavigate();
  const { goals } = useGameData();
  const { actions } = usePlayerState();

  const handleSelectGoal = (goalId: string) => {
    actions.setGoal(goalId);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Target className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">Choose Your Life Goal</h1>
        </div>
        <p className="text-gray-600">Select a path that resonates with your vision for restoration</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal.id)}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`${goal.themeColor} p-3 rounded-lg text-white text-2xl`}>
                  {goal.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-narrative mb-2 group-hover:text-dream-primary transition">
                    {goal.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <p className="text-sm text-gray-500 italic">{goal.worldPhilosophy}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}