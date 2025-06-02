import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';
import { Goal } from '../services/GameDataService';

// Separate component for individual goal cards
function GoalCard({ goal, onSelect }: { goal: Goal; onSelect: (id: string) => void }) {
  const { zones } = useGameData(goal.id);
  const { playerState } = usePlayerState();
  
  // Check if all zones for this goal are restored
  const isCompleted = React.useMemo(() => {
    if (!zones || zones.length === 0) return false;
    return zones.every(zone => playerState.worldZonesRestored.includes(zone.id));
  }, [zones, playerState.worldZonesRestored]);

  const isSelected = playerState.selectedGoalId === goal.id;

  return (
    <button
      onClick={() => onSelect(goal.id)}
      className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-left group"
    >
      <div className="flex items-start gap-4">
        <div className={`${goal.themeColor} p-3 rounded-lg text-white text-2xl`}>
          {goal.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-narrative mb-2 group-hover:text-dream-primary transition">
              {goal.title}
            </h2>
            {isCompleted && (
              <span className="flex items-center gap-1 text-harmony-high text-sm">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
            {!isCompleted && isSelected && (
              <span className="flex items-center gap-1 text-dream-primary text-sm">
                <Target className="w-4 h-4" />
                Selected
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{goal.description}</p>
          <p className="text-sm text-gray-500 italic">{goal.worldPhilosophy}</p>
        </div>
      </div>
    </button>
  );
}

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
            <GoalCard
              key={goal.id}
              goal={goal}
              onSelect={handleSelectGoal}
            />
          ))}
        </div>
      </main>
    </div>
  );
}