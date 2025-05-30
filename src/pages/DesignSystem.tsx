import React from 'react';
import { Palette, Type, Layout, Bell, Sparkles } from 'lucide-react';

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface overflow-y-auto">
      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-narrative mb-4">The Dream Design System</h1>
        <p className="text-base text-gray-600">A comprehensive guide to our design language</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-16">
        {/* Typography */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Type className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Typography</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md space-y-6">
            <div>
              <h3 className="text-4xl font-narrative mb-2">Title Text</h3>
              <code className="text-sm text-gray-500">font-narrative text-4xl</code>
            </div>
            <div>
              <h4 className="text-2xl font-interface mb-2">Header Text</h4>
              <code className="text-sm text-gray-500">font-interface text-2xl</code>
            </div>
            <div>
              <p className="text-base mb-2">Body Text</p>
              <code className="text-sm text-gray-500">text-base</code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Small Text</p>
              <code className="text-sm text-gray-500">text-sm text-gray-600</code>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Colors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-md space-y-4">
              <h3 className="text-xl font-interface mb-4">Primary Colors</h3>
              <div className="space-y-4">
                <div className="h-16 bg-dream-primary rounded-lg" />
                <div className="h-16 bg-dream-secondary rounded-lg" />
                <div className="h-16 bg-dream-contrast rounded-lg" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md space-y-4">
              <h3 className="text-xl font-interface mb-4">Harmony Scale</h3>
              <div className="space-y-4">
                <div className="h-16 bg-harmony-high rounded-lg" />
                <div className="h-16 bg-harmony-mid rounded-lg" />
                <div className="h-16 bg-harmony-low rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Layout className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Components</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-interface mb-6">Buttons</h3>
              <div className="space-y-4">
                <button className="bg-dream-primary hover:bg-dream-primary-hover text-white px-4 py-2 rounded-lg transition w-full">
                  Primary Button
                </button>
                <button className="bg-dream-secondary hover:bg-dream-secondary/90 text-white px-4 py-2 rounded-lg transition w-full">
                  Secondary Button
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-interface mb-6">Cards</h3>
              <div className="bg-dream-zone-bg p-4 rounded-2xl shadow-md">
                <h4 className="font-interface text-lg mb-2">Card Example</h4>
                <p className="text-gray-600 text-sm">A sample card component</p>
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Animations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <Bell className="w-8 h-8 mx-auto mb-4 animate-[sway_3s_ease-in-out_infinite] text-dream-primary" />
              <p className="text-sm text-gray-600">Sway Animation</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-8 h-8 mx-auto mb-4 bg-dream-primary rounded-full animate-pulse" />
              <p className="text-sm text-gray-600">Pulse Animation</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <button className="bg-dream-primary text-white px-4 py-2 rounded-lg transition hover:scale-105">
                Hover Scale
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}