import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Map, Package, Settings, Palette, Play } from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  subItems?: { href: string; label: string }[];
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label, isActive, subItems }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  if (subItems) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isActive 
              ? 'bg-dream-primary text-white' 
              : 'hover:bg-dream-primary/10'
          }`}
        >
          {icon}
          <span className="font-interface flex-1 text-left">{label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {subItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${
                  location.pathname === item.href
                    ? 'bg-dream-primary/20 text-dream-primary'
                    : 'hover:bg-dream-primary/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        isActive 
          ? 'bg-dream-primary text-white' 
          : 'hover:bg-dream-primary/10'
      }`}
    >
      {icon}
      <span className="font-interface">{label}</span>
    </Link>
  );
};

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-narrative text-dream-primary">The Dream</h1>
      </div>
      
      <div className="space-y-2">
        <NavLink 
          href="/"
          icon={<Home className="w-5 h-5" />}
          label="Home"
          isActive={currentPath === '/'}
        />
        <NavLink 
          href="/choose-goal"
          icon={<Play className="w-5 h-5" />}
          label="Play"
          isActive={currentPath === '/choose-goal'}
        />
        <NavLink 
          href="/map"
          icon={<Map className="w-5 h-5" />}
          label="World Map"
          isActive={currentPath === '/map'}
        />
        <NavLink 
          href="/inventory"
          icon={<Package className="w-5 h-5" />}
          label="Inventory"
          isActive={currentPath === '/inventory'}
        />
        <NavLink 
          href="/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          isActive={currentPath === '/design' || currentPath === '/config'}
          subItems={[
            { href: '/design', label: 'Design System' },
            { href: '/config', label: 'Game Config' }
          ]}
        />
      </div>
    </nav>
  );
}