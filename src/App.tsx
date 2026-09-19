import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { FreightForecastPage } from './pages/FreightForecastPage';
import { CharterOptimizerPage } from './pages/CharterOptimizerPage';
import { VesselRecommendationPage } from './pages/VesselRecommendationPage';
import { PortDatabasePage } from './pages/PortDatabasePage';
import { RiskAlertsPage } from './pages/RiskAlertsPage';
import { ContractStrategyPage } from './pages/ContractStrategyPage';
import { WeatherIntelligencePage } from './pages/WeatherIntelligencePage';
import { PipelineEnginePage } from './pages/PipelineEnginePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { NavTab, User } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('freightai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('Australia (Port Hedland) → Paradip (Coking Coal)');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('freightai_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('freightai_user');
    } catch (e) {
      console.error(e);
    }
  };

  // If user is not logged in, render the Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigateTab={setCurrentTab} />;
      case 'forecast':
        return <FreightForecastPage />;
      case 'optimizer':
        return <CharterOptimizerPage />;
      case 'vessels':
        return <VesselRecommendationPage />;
      case 'ports':
        return <PortDatabasePage />;
      case 'risks':
        return <RiskAlertsPage />;
      case 'strategy':
        return <ContractStrategyPage />;
      case 'weather':
        return <WeatherIntelligencePage />;
      case 'pipelines':
        return <PipelineEnginePage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#080D1A] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-grid-pattern">
        {/* Top Navbar with Profile & Logout */}
        <Navbar
          onNavigateTab={setCurrentTab}
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
