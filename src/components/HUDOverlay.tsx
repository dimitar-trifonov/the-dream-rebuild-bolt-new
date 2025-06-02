import React from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useGameData } from '../hooks/useGameData';
import { Mission, WorldEvent } from '../services/GameDataService';
import { useLocation } from 'react-router-dom';

export default function HUDOverlay() {
  const { playerState } = usePlayerState();
  const { currentWorld } = useGameData(playerState.selectedGoalId || undefined);
  const location = useLocation();
  const isInZoneExploration = true;

  // Calculate total harmony possible from missions and events
  const totalHarmonyPossible = currentWorld 
    ? currentWorld.missions.reduce((sum: number, mission: Mission) => sum + mission.harmonyReward, 0) +
      currentWorld.worldEvents.reduce((sum: number, event: WorldEvent) => sum + event.harmonyReward, 0)
    : 0;

  const harmonyRatio = totalHarmonyPossible > 0
    ? playerState.currentHarmonyScore / totalHarmonyPossible 
    : 0;

  const formatTime = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  // Get the current zone and its event
  const currentZone = currentWorld?.zones.find(zone => 
    zone.locations.some(loc => 
      loc.coordinates[0] === playerState.currentLocation?.x && 
      loc.coordinates[1] === playerState.currentLocation?.y
    )
  );

  const zoneEvent = currentZone?.locations
    .find(loc => loc.items.some(item => item.type === 'worldEvents'))
    ?.items.find(item => item.type === 'worldEvents');

  const currentEvent = zoneEvent?.id ? 
    currentWorld?.worldEvents.find(event => event.id === zoneEvent.id) : 
    undefined;

  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-3 min-w-[200px]">
      {/* Harmony Meter */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Harmony</span>
          <span className="text-sm text-harmony-high">
            {Math.round(harmonyRatio * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-harmony-high transition-all duration-500"
            style={{ width: `${harmonyRatio * 100}%` }}
          />
        </div>
      </div>

      {/* Total Time */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Time</span>
          <span className="text-sm text-dream-primary">
            {formatTime(playerState.timeTracking.totalTime)}
          </span>
        </div>
        {isInZoneExploration && currentEvent && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium">Event Time Limit</span>
            <span className="text-sm text-dream-contrast">
              {formatTime(parseInt(currentEvent.eventTimeLimit))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 