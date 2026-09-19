import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Ship, 
  Anchor, 
  AlertTriangle, 
  FileText, 
  CloudRain, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  Sparkles,
  SlidersHorizontal,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { NavTab } from '../../types';
import clsx from 'clsx';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Freight Forecast', icon: TrendingUp, badge: 'HGBR' },
    { id: 'optimizer', label: 'Charter Optimizer', icon: SlidersHorizontal, badge: 'Save 16%' },
    { id: 'vessels', label: 'Vessel Recommendation', icon: Ship },
    { id: 'ports', label: 'Port Database', icon: Anchor },
    { id: 'risks', label: 'Risk & Alerts', icon: AlertTriangle, badge: '3 Act' },
    { id: 'strategy', label: 'Contract Strategy', icon: FileText },
    { id: 'weather', label: 'Weather Intelligence', icon: CloudRain, badge: 'Live' },
    { id: 'pipelines', label: 'ML Pipeline Engine', icon: Cpu, badge: '4 Core' },
    { id: 'reports', label: 'Procurement Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col border-r border-slate-800 bg-[#0A0F1D]/90 backdrop-blur-xl transition-all duration-300 z-30 select-none h-screen sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue flex-shrink-0">
            <Ship className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                  FreightAI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SIH 2026
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                Maritime Bulk Logistics
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Intelligent Platform
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-blue-600 text-white shadow-glow-blue font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                )}
              />
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  )}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && isActive && (
                <span className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-white rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom AI Status & User Info */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200">Ensemble AI v4.2</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">94.8% Acc</span>
              </div>
              <span className="text-[10px] text-slate-400 truncate">Prophet + LSTM Hybrid</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="AI Model: Active (94.8% Accuracy)">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
