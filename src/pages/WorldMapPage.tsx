import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Target, Tool, Bot } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

export default function WorldMapPage() {
  const navigate = useNavigate();
  const { playerState } = usePlayerState();
  const { zones, currentGoal, currentWorld } = useGameData(playerState.selectedGoalId || undefined);

  if (!currentGoal || !zones || !currentWorld) {
    navigate('/choose-goal');
    return null;
  }

  const handleZoneClick = (zoneId: string) => {
    navigate(`/zone/${zoneId}`);
  };

  const getZoneStatus = (zoneId: string) => {
    if (playerState.worldZonesRestored.includes(zoneId)) return 'Restored';
    if (playerState.missionsCompleted.some(mId => zones.find(z => z.id === zoneId)?.missions.includes(mId))) return 'Healing';
    return 'Damaged';
  };

  const getZoneItems = (zone: typeof zones[0]) => {
    const items = {
      missions: zone.missions.length,
      tools: zone.locations.filter(loc => loc.items.some(item => item.type === 'tools')).length,
      aiNodes: zone.locations.filter(loc => loc.items.some(item => item.type === 'aiNodes')).length,
    };
    return items;
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <MapIcon className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{currentGoal.title}</h1>
        </div>
        <p className="text-gray-600">{currentGoal.description}</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const items = getZoneItems(zone);
            const status = getZoneStatus(zone.id);
            
            return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-left group ${
                status === 'Restored' ? 'border-2 border-harmony-high' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`${currentGoal.themeColor} p-3 rounded-lg text-white text-2xl`}>
                  {currentGoal.icon}
                </div>
                <div>
                  <h2 className="text-xl font-interface mb-2 group-hover:text-dream-primary transition">
                    {zone.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full ${
                      status === 'Restored' ? 'bg-harmony-high text-white' :
                      status === 'Healing' ? 'bg-harmony-mid text-white' :
                      'bg-harmony-low'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{items.missions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tool className="w-4 h-4" />
                      <span>{items.tools}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      <span>{items.aiNodes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )})}
        </div>
      </main>
    </div>
  );
}