import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, ArrowLeft, Bot, PenTool as Tool, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

type Location = {
  id: string;
  coordinates: [number, number];
  items: Array<{
    type: string;
    id: string;
  }>;
};

export default function MissionExplorationPage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { zones, currentWorld } = useGameData(playerState.selectedGoalId);

  const zone = zones?.find(z => z.id === zoneId);
  
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    // Find starting position (location with start item)
    const startLocation = zone?.locations.find(loc => 
      loc.items.some(item => item.type === 'start')
    );
    if (startLocation) {
      setCurrentPosition(startLocation.coordinates);
      actions.updateLocation(startLocation.coordinates[0], startLocation.coordinates[1]);
    }
  }, [zone]);

  const getLocationAt = useCallback((x: number, y: number): Location | undefined => {
    return zone?.locations.find(loc => 
      loc.coordinates[0] === x && loc.coordinates[1] === y
    );
  }, [zone]);

  const isValidMove = useCallback((x: number, y: number): boolean => {
    if (!zone) return false;
    
    // Check bounds
    if (x < 0 || x >= zone.gridSize[0] || y < 0 || y >= zone.gridSize[1]) {
      return false;
    }

    // Check if terrain is passable
    const location = getLocationAt(x, y);
    if (!location) return false;

    const terrain = currentWorld?.terrain.find(t => 
      location.items.some(item => item.type === 'terrain' && item.id === t.id)
    );

    return terrain?.timeCost !== null;
  }, [zone, currentWorld, getLocationAt]);

  const handleMove = useCallback((newX: number, newY: number) => {
    if (isValidMove(newX, newY)) {
      setCurrentPosition([newX, newY]);
      actions.updateLocation(newX, newY);
    }
  }, [isValidMove, actions]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const [x, y] = currentPosition;
    
    switch (e.key) {
      case 'ArrowUp':
        handleMove(x, y - 1);
        break;
      case 'ArrowDown':
        handleMove(x, y + 1);
        break;
      case 'ArrowLeft':
        handleMove(x - 1, y);
        break;
      case 'ArrowRight':
        handleMove(x + 1, y);
        break;
    }
  }, [currentPosition, handleMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!zone || !currentWorld) {
    navigate('/map');
    return null;
  }

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <button
          onClick={() => navigate(`/zone/${zoneId}`)}
          className="flex items-center gap-2 text-dream-primary hover:text-dream-primary-hover transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Zone
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{zone.name}</h1>
        </div>
        <p className="text-gray-600">Navigate the zone to collect tools and meet AI Nodes</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Grid Navigation */}
          <div className="lg:col-span-2">
            <div 
              className="grid gap-2 bg-white p-4 rounded-2xl shadow-md"
              style={{
                gridTemplateColumns: `repeat(${zone.gridSize[0]}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${zone.gridSize[1]}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: zone.gridSize[1] }, (_, y) =>
                Array.from({ length: zone.gridSize[0] }, (_, x) => {
                  const location = getLocationAt(x, y);
                  const terrain = location && currentWorld.terrain.find(t => 
                    location.items.some(item => item.type === 'terrain' && item.id === t.id)
                  );
                  const isCurrentPosition = x === currentPosition[0] && y === currentPosition[1];
                  const isValidNextMove = isValidMove(x, y);

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => {
                        // Only allow moving to adjacent tiles
                        const dx = Math.abs(x - currentPosition[0]);
                        const dy = Math.abs(y - currentPosition[1]);
                        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                          handleMove(x, y);
                        }
                      }}
                      disabled={!isValidNextMove}
                      className={`
                        aspect-square rounded-lg p-2 flex items-center justify-center
                        transition-all duration-200
                        ${isCurrentPosition ? 'ring-2 ring-dream-primary' : ''}
                        ${isValidNextMove ? 'hover:bg-dream-primary/10 cursor-pointer' : 'cursor-not-allowed'}
                        ${terrain?.timeCost === null ? 'bg-gray-200' : 'bg-dream-zone-bg'}
                      `}
                      style={{ position: 'relative' }}
                    >
                      {location?.items.map((item, idx) => {
                        if (item.type === 'terrain') {
                          const terrainData = currentWorld.terrain.find(t => t.id === item.id);
                          return (
                            <span key={idx} className="absolute bottom-1 right-1 text-2xl opacity-50">
                              {terrainData?.icon}
                            </span>
                          );
                        }
                        if (item.type === 'tools') {
                          const tool = currentWorld.tools.find(t => t.id === item.id);
                          return (
                            <span key={idx} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                              <Tool className="w-6 h-6 text-dream-primary" />
                            </span>
                          );
                        }
                        if (item.type === 'aiNodes') {
                          const node = currentWorld.aiNodes.find(n => n.id === item.id);
                          return (
                            <span key={idx} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                              <Bot className="w-6 h-6 text-dream-primary" />
                            </span>
                          );
                        }
                        if (item.type === 'worldEvents') {
                          const event = currentWorld.worldEvents.find(e => e.id === item.id);
                          return (
                            <span key={idx} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                              <Target className="w-6 h-6 text-dream-contrast" />
                            </span>
                          );
                        }
                        return null;
                      })}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Current Location</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Coordinates</span>
                  <span className="font-mono">
                    [{currentPosition[0]}, {currentPosition[1]}]
                  </span>
                </div>
                
                {/* Location Items */}
                {getLocationAt(currentPosition[0], currentPosition[1])?.items.map((item, idx) => {
                  if (item.type === 'tools') {
                    const tool = currentWorld.tools.find(t => t.id === item.id);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <Tool className="w-4 h-4 text-dream-primary" />
                        <span>{tool?.name}</span>
                      </div>
                    );
                  }
                  if (item.type === 'aiNodes') {
                    const node = currentWorld.aiNodes.find(n => n.id === item.id);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-dream-primary" />
                        <span>{node?.name}</span>
                      </div>
                    );
                  }
                  if (item.type === 'worldEvents') {
                    const event = currentWorld.worldEvents.find(e => e.id === item.id);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-dream-primary" />
                        <span>{event?.name}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </section>

            {/* Navigation Help */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Navigation</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Use arrow keys or click adjacent tiles to move</p>
                <p>🪨 Rock terrain cannot be crossed</p>
                <p>Movement time depends on terrain type</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}