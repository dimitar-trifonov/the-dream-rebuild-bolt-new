import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Leaf } from 'lucide-react';

const zones = [
  {
    id: 'zone1',
    name: 'Verdant Hollow',
    status: 'Damaged',
    missions: 1,
    icon: <Leaf className="w-6 h-6" />,
  },
  {
    id: 'zone2',
    name: 'Misty Grove',
    status: 'Damaged',
    missions: 2,
    icon: <Leaf className="w-6 h-6" />,
  },
];

export default function WorldMapPage() {
  const navigate = useNavigate();

  const handleZoneClick = (zoneId: string) => {
    navigate(`/zone/${zoneId}`);
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <MapIcon className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">World Map</h1>
        </div>
        <p className="text-gray-600">Explore zones and discover missions</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-dream-primary p-3 rounded-lg text-white">
                  {zone.icon}
                </div>
                <div>
                  <h2 className="text-xl font-interface mb-2 group-hover:text-dream-primary transition">
                    {zone.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-harmony-low rounded-full">
                      {zone.status}
                    </span>
                    <span>{zone.missions} missions</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}