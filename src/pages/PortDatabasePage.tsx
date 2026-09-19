import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { EastCoastPortMap } from '../components/maps/EastCoastPortMap';
import { EAST_COAST_PORTS } from '../data/mockData';
import { PortData } from '../types';
import { 
  Anchor, 
  Search, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter,
  Layers
} from 'lucide-react';
import clsx from 'clsx';

export const PortDatabasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'moderate' | 'critical'>('all');
  const [sortField, setSortField] = useState<keyof PortData>('capacity');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPortId, setSelectedPortId] = useState<string>('paradip');

  const filteredPorts = useMemo(() => {
    return EAST_COAST_PORTS.filter((p: PortData) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.majorCargo.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || p.congestionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a: PortData, b: PortData) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortAsc 
          ? (aVal as string).localeCompare(bVal as string) 
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [searchQuery, statusFilter, sortField, sortAsc]);

  const handleSort = (field: keyof PortData) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (status: PortData['congestionStatus'], waitTime: number) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Normal ({waitTime}h wait)
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Moderate ({waitTime}h wait)
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Congested ({waitTime}h wait)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Port Specification Database & East Coast Registry
            </h1>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
              Hydrographic Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official channel depths, length overall constraints, and live berthing congestion monitors for key Indian bulk ports.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="emerald" size="md">Paradip: 14.5m Draft Ready</Badge>
        </div>
      </div>

      {/* Top: Search & Filter Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ports by name, state, or cargo type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['all', 'normal', 'moderate', 'critical'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg font-medium transition-all capitalize',
                  statusFilter === s
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                )}
              >
                {s === 'all' ? 'All Ports (6)' : s}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Middle: Interactive India East Coast Map with Pins */}
      <EastCoastPortMap
        selectedPortId={selectedPortId}
        onSelectPort={(port) => setSelectedPortId(port.id)}
      />

      {/* Bottom: Sortable Table */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              East Coast Port Technical Specifications Directory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click table headers to sort by Draft, LOA, Capacity or Wait Time.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Showing {filteredPorts.length} Ports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Port Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('draft')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Max Draft (m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('loa')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Max LOA (m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('beamLimit')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Beam Limit (m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('capacity')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Annual Capacity (MTPA)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('waitTimeHours')}
                  className="py-3 px-4 cursor-pointer hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Congestion Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Primary Cargo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredPorts.map((port: PortData) => {
                const isSelected = selectedPortId === port.id;
                return (
                  <tr
                    key={port.id}
                    onClick={() => setSelectedPortId(port.id)}
                    className={clsx(
                      'cursor-pointer transition-colors',
                      isSelected ? 'bg-blue-950/30 font-medium' : 'hover:bg-slate-800/40'
                    )}
                  >
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Anchor className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{port.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({port.state})</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {port.draft.toFixed(2)} m
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {port.loa.toFixed(1)} m
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {port.beamLimit.toFixed(1)} m
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-200 font-semibold">
                      {port.capacity} MTPA
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(port.congestionStatus, port.waitTimeHours)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {port.majorCargo.slice(0, 2).map((c: string) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
