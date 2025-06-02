import { useState, useEffect, useCallback } from 'react';
import { playerStateService, PlayerState } from '../services/PlayerStateService';

export function usePlayerState() {
  const [playerState, setPlayerState] = useState<PlayerState>(
    playerStateService.getState()
  );

  const refreshState = useCallback(() => {
    setPlayerState(playerStateService.getState());
  }, []);

  useEffect(() => {
    // Listen for storage events to sync state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dreamGamePlayerState') {
        refreshState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshState]);

  const actions = {
    setGoal: (goalId: string) => {
      playerStateService.setGoal(goalId);
      refreshState();
    },
    addLearnedSkill: (skillId: string) => {
      playerStateService.addLearnedSkill(skillId);
      refreshState();
    },
    addAcquiredTool: (toolId: string) => {
      playerStateService.addAcquiredTool(toolId);
      refreshState();
    },
    addInventoryNode: (nodeId: string) => {
      playerStateService.addInventoryNode(nodeId);
      refreshState();
    },
    updateHarmonyScore: (score: number) => {
      playerStateService.updateHarmonyScore(score);
      refreshState();
    },
    startMission: (missionId: string) => {
      playerStateService.startMission(missionId);
      refreshState();
    },
    completeMission: (missionId: string) => {
      playerStateService.completeMission(missionId);
      refreshState();
    },
    restoreZone: (zoneId: string) => {
      playerStateService.restoreZone(zoneId);
      refreshState();
    },
    addRestoredEvent: (eventId: string) => {
      playerStateService.addRestoredEvent(eventId);
      refreshState();
    },
    updateLocation: (x: number, y: number) => {
      playerStateService.updateLocation(x, y);
      refreshState();
    },
    addTime: (hours: number) => {
      playerStateService.addTime(hours);
      refreshState();
    },
    resetState: () => {
      playerStateService.resetState();
      refreshState();
    },
  };

  return { playerState, actions };
}