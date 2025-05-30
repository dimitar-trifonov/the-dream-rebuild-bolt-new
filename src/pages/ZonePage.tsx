import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';
import MissionCard from '../components/MissionCard';

export default function ZonePage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { playerState } = usePlayerState();
  const { zones, currentGoal } = useGameData(playerState.selectedGoalId || undefined);

  const zone = zones?.find(z => z.id === zoneId);

  if (!zone || !currentGoal) {
    navigate('/map');
    return null;
  }

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{zone.name}</h1>
        </div>
        <p className="text-gray-600">Complete missions to restore harmony to this zone</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(`/zone/${zoneId}/explore`)}
            className="bg-dream-primary hover:bg-dream-primary-hover text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Map className="w-5 h-5" />
            Explore Zone
          </button>
        </div>

        {/* Missions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-interface flex items-center gap-2">
              <Target className="w-6 h-6 text-dream-primary" />
              Available Missions
            </h2>
            <button 
              onClick={() => navigate('/map')}
              className="text-dream-primary hover:text-dream-primary-hover transition"
            >
              Return to Map
            </button>
          </div>

          <div className="space-y-4">
            {zone.missions.map(missionId => (
              <MissionCard 
                key={missionId}
                missionId={missionId}
                zoneId={zone.id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}