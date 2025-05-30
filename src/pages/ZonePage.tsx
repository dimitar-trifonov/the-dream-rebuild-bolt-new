import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, Target, PenTool as Tool, Bot } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

type GridItem = {
  type: string;
  id: string;
  icon?: string;
};

type GridCell = {
  id: string;
  coordinates: [number, number];
  terrain: GridItem;
  items: GridItem[];
};

export default function ZonePage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { zones, currentGoal, currentWorld } = useGameData(playerState.selectedGoalId || undefined);

  // Call useMemo for zone before any conditional returns
  const zone = useMemo(() => zones?.find(z => z.id === zoneId), [zones, zoneId]);

  // Call useMemo for grid before any conditional returns, but guard the calculation
  const grid = useMemo(() => {
    if (!zone) return [];

    const gridData: GridCell[][] = Array(zone.gridSize[1]).fill(null)
      .map(() => Array(zone.gridSize[0]).fill(null));

    zone.locations.forEach(location => {
      const [x, y] = location.coordinates;
      const terrain = location.items.find(item => item.type === 'terrain');
      const otherItems = location.items.filter(item => item.type !== 'terrain');

      if (terrain) {
        gridData[y][x] = {
          id: location.id,
          coordinates: [x, y],
          terrain: terrain,
          items: otherItems
        };
      }
    });

    return gridData;
  }, [zone]);

  // Early return after all hooks are called
  if (!zone || !currentGoal || !currentWorld) {
    navigate('/map');
    return null;
  }

  const isAdjacent = (current: number[], target: number[]): boolean => {
    const [cx, cy] = current;
    const [tx, ty] = target;
    return Math.abs(cx - tx) + Math.abs(cy - ty) === 1;
  };

  const handleCellClick = (cell: GridCell) => {
    const [targetX, targetY] = cell.coordinates;
    const currentLocation = playerState.currentLocation;

    // If no current location, only allow starting position
    if (!currentLocation) {
      const isStart = cell.items.some(item => item.type === 'start');
      if (isStart) {
        actions.updateLocation(targetX, targetY);
      }
      return;
    }

    // Check if move is adjacent and terrain is passable
    if (isAdjacent([currentLocation.x, currentLocation.y], [targetX, targetY])) {
      const terrain = currentWorld.terrain.find(t => t.id === cell.terrain.id);
      if (terrain?.timeCost !== null) {
        actions.updateLocation(targetX, targetY);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{zone.name}</h1>
        </div>
        <p className="text-gray-600">Navigate the zone to collect tools and complete missions</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Zone Grid */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md">
            <div 
              className="grid gap-2" 
              style={{ 
                gridTemplateColumns: `repeat(${zone.gridSize[0]}, minmax(0, 1fr))`,
              }}
            >
              {grid.flat().map((cell) => {
                if (!cell) return null;
                const [x, y] = cell.coordinates;
                const isCurrentLocation = playerState.currentLocation?.x === x && 
                                       playerState.currentLocation?.y === y;
                const terrain = currentWorld.terrain.find(t => t.id === cell.terrain.id);
                const isPassable = terrain?.timeCost !== null;

                return (
                  <button
                    key={cell.id}
                    onClick={() => handleCellClick(cell)}
                    disabled={!isPassable}
                    className={`
                      aspect-square rounded-lg p-2 relative
                      ${isPassable ? 'hover:bg-dream-primary/10 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'}
                      ${isCurrentLocation ? 'ring-2 ring-dream-primary' : ''}
                    `}
                  >
                    {/* Terrain */}
                    <div className="text-2xl mb-2">{terrain?.icon}</div>
                    
                    {/* Items */}
                    <div className="absolute top-1 right-1 flex flex-col gap-1">
                      {cell.items.map((item, idx) => (
                        <div 
                          key={`${item.type}-${item.id}-${idx}`}
                          className="w-6 h-6 flex items-center justify-center"
                        >
                          {item.type === 'tools' && <Tool className="w-4 h-4" />}
                          {item.type === 'aiNodes' && <Bot className="w-4 h-4" />}
                          {item.type === 'worldEvents' && <Target className="w-4 h-4" />}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone Info */}
          <div className="space-y-6">
            {/* Terrain Legend */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Terrain Types</h2>
              <div className="space-y-3">
                {currentWorld.terrain.map(terrain => (
                  <div key={terrain.id} className="flex items-center gap-3">
                    <span className="text-2xl">{terrain.icon}</span>
                    <div>
                      <p className="font-medium capitalize">{terrain.terrainType}</p>
                      <p className="text-sm text-gray-600">
                        {terrain.timeCost === null 
                          ? 'Impassable' 
                          : `${terrain.timeCost}h to cross`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Available Actions */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Available Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/map')}
                  className="w-full bg-dream-primary hover:bg-dream-primary-hover text-white px-4 py-2 rounded-lg transition"
                >
                  Return to World Map
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}