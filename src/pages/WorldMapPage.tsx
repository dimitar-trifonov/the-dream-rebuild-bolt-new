import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Target, PenTool as Tool, Bot, CheckCircle } from 'lucide-react';
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
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    // Don't allow navigation if zone is fully completed
    if (isZoneFullyCompleted(zone)) {
      return;
    }

    navigate(`/zone/${zoneId}`);
  };

  const isZoneFullyCompleted = (zone: typeof zones[0]) => {
    // Check if all missions in the zone are completed
    const allMissionsCompleted = zone.missions.every(missionId => 
      playerState.missionsCompleted.includes(missionId)
    );

    // Check if all events in the zone are restored
    const allEventsRestored = zone.locations
      .filter(loc => loc.items.some(item => item.type === 'worldEvents'))
      .map(loc => loc.items.find(item => item.type === 'worldEvents')?.id)
      .filter((id): id is string => id !== undefined)
      .every(eventId => playerState.restoredEvents.includes(eventId));

    return allMissionsCompleted && allEventsRestored;
  };

  const getZoneStatus = (zone: typeof zones[0]) => {
    if (isZoneFullyCompleted(zone)) return 'Completed';
    if (playerState.worldZonesRestored.includes(zone.id)) return 'Restored';
    if (playerState.missionsCompleted.some(mId => zone.missions.includes(mId))) return 'Healing';
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

  const getZoneCompletionDetails = (zone: typeof zones[0]) => {
    const completedMissions = zone.missions.filter(missionId => 
      playerState.missionsCompleted.includes(missionId)
    );
    const totalMissions = zone.missions.length;
    const completedEvents = zone.locations
      .filter(loc => loc.items.some(item => item.type === 'worldEvents'))
      .map(loc => loc.items.find(item => item.type === 'worldEvents')?.id)
      .filter((id): id is string => id !== undefined)
      .filter(eventId => playerState.restoredEvents.includes(eventId));
    const totalEvents = zone.locations.filter(loc => 
      loc.items.some(item => item.type === 'worldEvents')
    ).length;

    return {
      missions: { completed: completedMissions.length, total: totalMissions },
      events: { completed: completedEvents.length, total: totalEvents }
    };
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
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {zones.map(zone => {
            const status = getZoneStatus(zone);
            const items = getZoneItems(zone);
            const completion = getZoneCompletionDetails(zone);
            const isCompleted = status === 'Completed';

            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                className={`
                  bg-white rounded-2xl p-6 shadow-md cursor-pointer
                  transition-all duration-200
                  ${isCompleted ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-interface">{zone.name}</h2>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-harmony-high" />
                  )}
                </div>

                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className={`
                    inline-block px-3 py-1 rounded-full text-sm
                    ${status === 'Completed' ? 'bg-harmony-high/10 text-harmony-high' :
                      status === 'Restored' ? 'bg-dream-primary/10 text-dream-primary' :
                      status === 'Healing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {status}
                  </div>

                  {/* Completion Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Missions</span>
                      <span>{completion.missions.completed}/{completion.missions.total}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Events</span>
                      <span>{completion.events.completed}/{completion.events.total}</span>
                    </div>
                  </div>

                  {/* Zone Items */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
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
            );
          })}
        </div>
      </main>
    </div>
  );
}