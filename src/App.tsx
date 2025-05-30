import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DesignSystem from './pages/DesignSystem'
import HomePage from './pages/HomePage'
import ConfigPage from './pages/ConfigPage'
import GoalSelectionPage from './pages/GoalSelectionPage'
import WorldMapPage from './pages/WorldMapPage'
import UserProfilePage from './pages/UserProfilePage'
import Navigation from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Navigation />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design" element={<DesignSystem />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/choose-goal" element={<GoalSelectionPage />} />
            <Route path="/map" element={<WorldMapPage />} />
            <Route path="/inventory" element={<UserProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
