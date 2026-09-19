import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  X,
  ExternalLink,
  LogOut,
  Shield,
  Building
} from 'lucide-react';
import { RISK_ALERTS } from '../../data/mockData';
import { NavTab, User } from '../../types';

interface NavbarProps {
  onNavigateTab: (tab: NavTab) => void;
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateTab,
  selectedRoute,
  onSelectRoute,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const routes = [
    'Australia (Port Hedland) → Paradip (Coking Coal)',
    'Australia (Newcastle) → Vizag (Thermal Coal)',
    'Indonesia (Samarinda) → Haldia (Thermal Coal)',
    'South Africa (Richards Bay) → Gangavaram (Coal)',
    'Guinea (Kamsar) → Dhamra (Bauxite)',
  ];

  const filteredRoutes = routes.filter(r => 
    r.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Route Quick Search & Switcher */}
      <div className="flex items-center gap-4 flex-1 max-w-xl relative">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search maritime shipping route, port, or cargo..."
            value={searchQuery || selectedRoute}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Route Dropdown Menu */}
        {showSearchDropdown && (
          <div className="absolute left-0 top-12 w-full bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 flex items-center justify-between">
              <span>Active Strategic Corridors</span>
              <span className="text-blue-400">SIH 2026 Core Data</span>
            </div>
            <div className="space-y-1 mt-1">
              {filteredRoutes.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onSelectRoute(r);
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{r}</span>
                  </div>
                  {selectedRoute === r && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live AI Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live AI Engine: 94.8% Accuracy</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 relative transition-colors"
            title="System Alerts & Warnings"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-sm text-white">Live Maritime Alerts</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                  3 Critical
                </span>
              </div>

              <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
                {RISK_ALERTS.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('risks');
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {alert.impactDescription}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateTab('risks');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <span>View All Anomaly Feeds</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md font-mono">
              {currentUser?.avatar || 'RS'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                {currentUser?.name || 'Capt. Rajesh Sharma'}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {currentUser?.role ? currentUser.role.split(' ')[0] + ' ' + (currentUser.role.split(' ')[1] || '') : 'Procurement Dir'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-xl">
              <div className="p-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white block">
                  {currentUser?.name || 'Capt. Rajesh Sharma'}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono truncate">
                  {currentUser?.email || 'rajesh.sharma@gmail.com'}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                    {currentUser?.loginProvider === 'google' ? 'Google / Gmail SSO' : 'Enterprise ID'}
                  </span>
                </div>
              </div>

              <div className="py-2 text-xs space-y-1">
                <div className="px-2 py-1.5 text-slate-300 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{currentUser?.organization || 'Steel Authority of India (SAIL)'}</span>
                </div>
                <div className="px-2 py-1.5 text-slate-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Access: Level 4 (Charter Authority)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full p-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
