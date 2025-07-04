import { World } from './GameDataService';

export interface PlayerState {
  selectedGoalId: string | null;
  currentHarmonyScore: number;
  learnedSkills: string[];
  skillsInTraining: string[];
  acquiredTools: string[];
  inventoryNodes: string[];
  missionsCompleted: string[];
  missionsInProgress: string[];
  worldZonesRestored: string[];
  restoredEvents: string[];
  currentLocation: { x: number; y: number } | null;
  timeTracking: {
    totalTime: number;
    currentEventTimeLimit: number | null;
    currentEventId: string | null;
    lastUpdateTimestamp: string;
  };
}

const STORAGE_KEY = 'dreamGamePlayerState';

const initialState: PlayerState = {
  selectedGoalId: null,
  currentHarmonyScore: 0,
  learnedSkills: [],
  skillsInTraining: [],
  acquiredTools: [],
  inventoryNodes: [],
  missionsCompleted: [],
  missionsInProgress: [],
  worldZonesRestored: [],
  restoredEvents: [],
  currentLocation: null,
  timeTracking: {
    totalTime: 0,
    currentEventTimeLimit: null,
    currentEventId: null,
    lastUpdateTimestamp: new Date().toISOString(),
  },
};

class PlayerStateService {
  private state: PlayerState;

  constructor() {
    this.state = this.loadState();
    if (this.state === initialState) {
      this.state = JSON.parse(JSON.stringify(initialState));
    }
  }

  private loadState(): PlayerState {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : JSON.parse(JSON.stringify(initialState));
  }

  private saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getState(): PlayerState {
    return this.state;
  }

  setGoal(goalId: string): void {
    // If selecting a different goal, reset the state
    if (this.state.selectedGoalId !== goalId) {
      // Create a new state object with all fields reset to initial values
      const newState = {
        ...JSON.parse(JSON.stringify(initialState)),
        selectedGoalId: goalId,
        timeTracking: {
          ...initialState.timeTracking,
          lastUpdateTimestamp: new Date().toISOString(),
        }
      };
      
      this.state = newState;
      this.saveState();
      return;
    }

    // If selecting the same goal, just update the selected goal
    this.state.selectedGoalId = goalId;
    this.saveState();
  }

  addLearnedSkill(skillId: string): void {
    if (!this.state.learnedSkills.includes(skillId)) {
      this.state.learnedSkills.push(skillId);
      this.saveState();
    }
  }

  addAcquiredTool(toolId: string): void {
    if (!this.state.acquiredTools.includes(toolId)) {
      this.state.acquiredTools.push(toolId);
      this.saveState();
    }
  }

  addInventoryNode(nodeId: string): void {
    if (!this.state.inventoryNodes.includes(nodeId)) {
      this.state.inventoryNodes.push(nodeId);
      this.saveState();
    }
  }

  updateHarmonyScore(score: number): void {
    this.state.currentHarmonyScore = score;
    this.saveState();
  }

  startMission(missionId: string): void {
    if (!this.state.missionsInProgress.includes(missionId)) {
      this.state.missionsInProgress.push(missionId);
      this.saveState();
    }
  }

  completeMission(missionId: string): void {
    this.state.missionsCompleted.push(missionId);
    this.state.missionsInProgress = this.state.missionsInProgress.filter(
      id => id !== missionId
    );
    this.saveState();
  }

  restoreZone(zoneId: string): void {
    if (!this.state.worldZonesRestored.includes(zoneId)) {
      this.state.worldZonesRestored.push(zoneId);
      this.saveState();
    }
  }

  updateLocation(x: number, y: number): void {
    this.state.currentLocation = { x, y };
    this.saveState();
  }

  addTime(hours: number): void {
    this.state.timeTracking.totalTime += hours;
    this.state.timeTracking.lastUpdateTimestamp = new Date().toISOString();
    this.saveState();
  }

  addRestoredEvent(eventId: string): void {
    if (!this.state.restoredEvents.includes(eventId)) {
      this.state.restoredEvents.push(eventId);
      this.saveState();
    }
  }

  resetState(): void {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.saveState();
  }
}

export const playerStateService = new PlayerStateService();