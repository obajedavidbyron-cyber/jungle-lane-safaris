import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Eye,
  ExternalLink,
  BookOpen,
  Compass,
  Search,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Navigation,
  Hotel,
  ShieldCheck,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  Plane,
  Shield,
  Layers,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  AnalyticsInsightsResponse,
  TimeRangeFilter,
  OutboundClickLog
} from '../../types';

interface OwnerAnalyticsViewProps {
  onNavigateHome?: () => void;
  onNavigateToAdmin?: () => void;
}

export const OwnerAnalyticsView: React.FC<OwnerAnalyticsViewProps> = ({
  onNavigateToAdmin
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');
  const [data, setData] = useState<AnalyticsInsightsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Table filter states
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditLinkType, setAuditLinkType] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'live'>('overview');

  const fetchInsights = async (selectedRange: TimeRangeFilter = timeRange, isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch(`/api/analytics/insights?timeRange=${selectedRange}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(timeRange);
  }, [timeRange]);

  // Auto-refresh interval (every 12 seconds when enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchInsights(timeRange, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, timeRange]);

  // Quick Simulation Helper for Owners to test live event pipeline
  const triggerSimulation = async (type: 'whatsapp' | 'lodge' | 'directions') => {
    setSimulating(true);
    try {
      if (type === 'whatsapp') {
        await fetch('/api/analytics/seed-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityName: 'WhatsApp Safari Consultation',
            linkType: 'WhatsApp',
            targetUrl: 'https://wa.me/254700000000'
          })
        });
        setStatusMessage('Simulated real-time WhatsApp inquiry conversion recorded!');
      } else if (type === 'lodge') {
        await fetch('/api/analytics/seed-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityName: 'Mara Serena Safari Lodge Booking',
            linkType: 'Partner Lodge',
            targetUrl: 'https://www.serenahotels.com/mara-serena'
          })
        });
        setStatusMessage('Simulated outbound referral click to Mara Serena Lodge!');
      } else if (type === 'directions') {
        await fetch('/api/analytics/seed-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityName: 'Google Maps Directions to Amboseli Park Gate',
            linkType: 'Directions/Map',
            targetUrl: 'https://maps.google.com/?q=Amboseli+National+Park'
          })
        });
        setStatusMessage('Simulated Google Maps navigation click recorded!');
      }
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchInsights(timeRange, true);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const resetData = async () => {
    if (!window.confirm('Reset all analytics metrics to zero values ready for fresh live use?')) return;
    try {
      await fetch('/api/analytics/reset', { method: 'POST' });
      setStatusMessage('Analytics metrics successfully reset to zero values. Ready for real-time tracking.');
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchInsights(timeRange);
    } catch (err) {
      console.error(err);
    }
  };

  const seedDemoData = async () => {
    try {
      await fetch('/api/analytics/seed-dataset', { method: 'POST' });
      setStatusMessage('Populated analytics with sample tourist demonstration dataset.');
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchInsights(timeRange);
    } catch (err) {
      console.error(err);
    }
  };

  // Export Outbound Log as CSV
  const exportOutboundCSV = () => {
    if (!data?.recentOutboundClicks?.length) return;
    const headers = ['ID', 'Entity/Attraction Name', 'Link Type', 'Target URL', 'Device Type', 'Timestamp', 'Session ID'];
    const rows = data.recentOutboundClicks.map((click) => [
      click.id,
      `"${click.entityName.replace(/"/g, '""')}"`,
      click.linkType,
      `"${click.targetUrl}"`,
      click.deviceType,
      click.timestamp,
      click.sessionId
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jungle-lane-safaris-outbound-audit-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Outbound Clicks
  const filteredOutboundClicks = useMemo(() => {
    if (!data?.recentOutboundClicks) return [];
    return data.recentOutboundClicks.filter((click) => {
      const matchSearch =
        click.entityName.toLowerCase().includes(auditSearch.toLowerCase()) ||
        click.targetUrl.toLowerCase().includes(auditSearch.toLowerCase()) ||
        click.sessionId.toLowerCase().includes(auditSearch.toLowerCase());
      const matchType = auditLinkType === 'All' || click.linkType === auditLinkType;
      return matchSearch && matchType;
    });
  }, [data?.recentOutboundClicks, auditSearch, auditLinkType]);

  // Helper for Link Type Badges
  const renderLinkBadge = (type: OutboundClickLog['linkType']) => {
    switch (type) {
      case 'WhatsApp':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            WhatsApp
          </span>
        );
      case 'Phone':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            <Phone className="w-3 h-3 text-blue-600" />
            Direct Call
          </span>
        );
      case 'Directions/Map':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <Navigation className="w-3 h-3 text-amber-600" />
            Directions / Map
          </span>
        );
      case 'Partner Lodge':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">
            <Hotel className="w-3 h-3 text-purple-600" />
            Partner Lodge
          </span>
        );
      case 'Park Permits':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800 border border-stone-400">
            <ShieldCheck className="w-3 h-3 text-stone-600" />
            Park Permits
          </span>
        );
      case 'Airline':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-300">
            <Plane className="w-3 h-3 text-cyan-600" />
            Bush Flight
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
            <ExternalLink className="w-3 h-3 text-stone-500" />
            External Link
          </span>
        );
    }
  };

  const renderDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone className="w-4 h-4 text-[#C86D51]" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4 text-[#E29578]" />;
      default:
        return <Monitor className="w-4 h-4 text-[#3A4F41]" />;
    }
  };

  const timeRangeOptions: { id: TimeRangeFilter; label: string }[] = [
    { id: 'today', label: 'Today (24h)' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'peak_season', label: 'Peak Season (Jul-Oct)' },
    { id: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-[#F4EFE6] min-h-screen pb-16 text-[#222222]">
      {/* Top Header & Breadcrumb Bar */}
      <div className="bg-[#3A4F41] text-[#F9F6F0] border-b border-[#2D3E33] sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-300 font-bold uppercase tracking-wider">
              <span className="bg-[#C86D51] text-white px-2 py-0.5 rounded-sm text-[10px]">
                Executive Intelligence
              </span>
              <span>/</span>
              <span>Owner & Marketing Analytics</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
              <span>Owner's Analytics Dashboard</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              Real-time traffic telemetry, destination attraction heatmaps, and outbound referral conversion tracking.
            </p>
          </div>

          {/* Top Switcher to Admin Dashboard & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Go to Admin Content & Database Management"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Management Portal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
                autoRefresh
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                  : 'bg-[#2D3E33] text-stone-300 border-stone-600 hover:text-white'
              }`}
              title="Toggle Live Stream Auto-Refresh every 12 seconds"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Live: {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => fetchInsights(timeRange)}
              disabled={loading}
              className="bg-[#2D3E33] hover:bg-[#223128] text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border border-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportOutboundCSV}
              className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download CSV report of all outbound referral clicks"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Date Range Selector & View Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#475F50]">
          {/* Time Range Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-300 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C86D51]" />
              Period:
            </span>
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeRange(opt.id)}
                className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === opt.id
                    ? 'bg-[#C86D51] text-white shadow-sm'
                    : 'bg-[#2D3E33]/80 text-stone-200 hover:bg-[#2D3E33] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#3A4F41]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white text-[#3A4F41]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Outbound Audit Log ({data?.recentOutboundClicks?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-white text-[#3A4F41]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Live Stream Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-sm shadow-md text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-200" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-emerald-200 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Live Simulation Testing Bar (for owner live demonstration) */}
        <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-[#3A4F41] text-white flex items-center justify-center font-bold text-xs">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A4F41]">
                Live Interaction Simulator
              </h4>
              <p className="text-[11px] text-stone-600">
                Trigger simulated tourist actions to inspect real-time dashboard calculations and outbound referral logs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerSimulation('whatsapp')}
              disabled={simulating}
              className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 px-2.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ WhatsApp Click</span>
            </button>

            <button
              onClick={() => triggerSimulation('lodge')}
              disabled={simulating}
              className="bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100 px-2.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Hotel className="w-3.5 h-3.5 text-purple-600" />
              <span>+ Mara Serena Partner</span>
            </button>

            <button
              onClick={() => triggerSimulation('directions')}
              disabled={simulating}
              className="bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 px-2.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Maps Directions</span>
            </button>

            <button
              onClick={seedDemoData}
              className="bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200 px-2.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              title="Populate with demo dataset"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Seed Demo Data</span>
            </button>

            <button
              onClick={resetData}
              className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-2.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset all analytics to 0 for clean live tracking"
            >
              <RotateCcw className="w-3 h-3 text-red-600" />
              <span>Reset to Zero</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && !data && (
          <div className="bg-white p-12 rounded-sm border border-stone-300 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#C86D51] animate-spin mx-auto" />
            <p className="font-serif font-bold text-lg text-[#3A4F41]">Aggregating Travel Analytics...</p>
            <p className="text-xs text-stone-500">Calculating visitor engagement, destination share, and referral logs.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-6 rounded-sm border border-red-200 text-center">
            <p className="font-bold text-sm">Failed to retrieve analytics data: {error}</p>
            <button
              onClick={() => fetchInsights(timeRange)}
              className="mt-3 bg-red-700 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {data && activeTab === 'overview' && (
          <>
            {/* ========================================================= */}
            {/* 1. KPI Summary Cards */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Visitors & Pageviews */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm relative overflow-hidden group hover:border-[#3A4F41] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Total Visitors
                  </span>
                  <div className="w-9 h-9 rounded-sm bg-stone-100 text-[#3A4F41] flex items-center justify-center group-hover:bg-[#3A4F41] group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-serif font-bold text-[#3A4F41]">
                    {data.kpis.totalVisitors.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                    <Eye className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span>
                      <strong className="text-[#222222]">{data.kpis.totalPageViews.toLocaleString()}</strong> Page Views
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Unique Browsing Sessions</span>
                  <span className="text-emerald-700 font-bold">● Active</span>
                </div>
              </div>

              {/* Outbound Referral Clicks & Conversion Rate */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm relative overflow-hidden group hover:border-[#C86D51] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Outbound Referral Clicks
                  </span>
                  <div className="w-9 h-9 rounded-sm bg-[#C86D51]/10 text-[#C86D51] flex items-center justify-center group-hover:bg-[#C86D51] group-hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-serif font-bold text-[#C86D51]">
                    {data.kpis.totalOutboundClicks.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{data.kpis.outboundConversionRate}% Referral Conversion</span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>WhatsApp / Phone / Partner Links</span>
                  <span className="font-semibold text-[#C86D51]">High Intent</span>
                </div>
              </div>

              {/* Total Itineraries / Bookmarks Created */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm relative overflow-hidden group hover:border-emerald-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Itineraries Created
                  </span>
                  <div className="w-9 h-9 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-serif font-bold text-emerald-800">
                    {data.kpis.totalItinerariesCreated.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      <strong className="text-[#222222]">{data.kpis.engagementRate}%</strong> Total Engagement
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>AI Plans + Custom Quotes</span>
                  <span className="text-emerald-700 font-bold">Qualified Leads</span>
                </div>
              </div>

              {/* Avg. Destinations Viewed Per Session */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm relative overflow-hidden group hover:border-[#3A4F41] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Avg. Destination Depth
                  </span>
                  <div className="w-9 h-9 rounded-sm bg-stone-100 text-[#3A4F41] flex items-center justify-center group-hover:bg-[#3A4F41] group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-serif font-bold text-[#3A4F41]">
                    {data.kpis.avgDestinationsViewedPerSession}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span>Parks & Attractions / User</span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Exploration Depth Index</span>
                  <span className="font-semibold text-stone-700">Healthy</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 2. Travel Analytics Charts */}
            {/* ========================================================= */}
            
            {/* Traffic Trends Line / Area Chart */}
            <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-stone-200 gap-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                    Traffic & Engagement Trends
                  </h3>
                  <p className="text-xs text-stone-500">
                    Daily unique visitors, total pageviews, and outbound referral conversion spikes for {data.timeRangeLabel}.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#3A4F41] rounded-xs inline-block" />
                    <span>Visitors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#C86D51] rounded-xs inline-block" />
                    <span>Page Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-600 rounded-xs inline-block" />
                    <span>Outbound Clicks</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trafficTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A4F41" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3A4F41" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pageviewGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C86D51" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C86D51" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#666666' }}
                      axisLine={{ stroke: '#cccccc' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#666666' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F9F6F0',
                        borderColor: '#d0c8b8',
                        borderRadius: '2px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#222222',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      name="Page Views"
                      stroke="#C86D51"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#pageviewGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Unique Visitors"
                      stroke="#3A4F41"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#visitorGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="outboundClicks"
                      name="Outbound Clicks"
                      stroke="#059669"
                      strokeWidth={2}
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Middle Grid: Popular Attractions (Bar Chart) & Device Breakdown (Donut Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top 10 Most Viewed Attractions / Destinations (Bar Chart) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-stone-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                        Top 10 Most Viewed Destinations & Attractions
                      </h3>
                      <p className="text-xs text-stone-500">
                        Ranked by traveler engagement volume & share of total destination views.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#C86D51] bg-[#C86D51]/10 px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      Popularity Index
                    </span>
                  </div>

                  {data.popularAttractions.length === 0 ? (
                    <div className="h-80 w-full flex flex-col items-center justify-center text-center p-6 bg-stone-50 border border-dashed border-stone-300 rounded-sm">
                      <Compass className="w-8 h-8 text-stone-400 mb-2" />
                      <p className="font-bold text-stone-700 text-sm">Ready for live attraction tracking</p>
                      <p className="text-xs text-stone-500 max-w-sm mt-1">
                        As prospective travelers explore Maasai Mara, Amboseli, and Diani Beach, real-time popularity rankings will populate here.
                      </p>
                    </div>
                  ) : (
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.popularAttractions}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eae5dd" />
                          <XAxis type="number" tick={{ fontSize: 11, fill: '#666666' }} axisLine={{ stroke: '#ccc' }} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#333333', fontWeight: 600 }}
                            width={140}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            formatter={(value: any, _name: any, item: any) => [
                              `${value} Views (${item.payload.sharePercentage}% share)`,
                              'Attraction Views'
                            ]}
                            contentStyle={{
                              backgroundColor: '#F9F6F0',
                              borderColor: '#d0c8b8',
                              borderRadius: '2px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          />
                          <Bar dataKey="views" name="Attraction Views" fill="#3A4F41" radius={[0, 3, 3, 0]}>
                            {data.popularAttractions.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? '#C86D51' : index === 1 ? '#3A4F41' : index === 2 ? '#4F6858' : '#72887A'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#C86D51] inline-block rounded-xs" />
                    <strong>#1 Destination:</strong>{' '}
                    {data.popularAttractions.length > 0
                      ? data.popularAttractions[0].name
                      : 'None recorded yet (Awaiting traffic)'}
                  </span>
                  <span>Total Attraction Engagements: <strong>{data.popularAttractions.reduce((acc, i) => acc + i.views, 0)}</strong></span>
                </div>
              </div>

              {/* Traffic Origin & Device Types Donut Chart */}
              <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="pb-3 mb-2 border-b border-stone-200">
                    <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                      Device & Origin Types
                    </h3>
                    <p className="text-xs text-stone-500">
                      Distribution of traveler devices accessing the portal.
                    </p>
                  </div>

                  <div className="h-56 w-full relative flex items-center justify-center">
                    {data.deviceBreakdown.reduce((sum, item) => sum + item.count, 0) === 0 ? (
                      <div className="text-center p-4">
                        <Smartphone className="w-7 h-7 text-stone-300 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-stone-500">No device sessions logged yet</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.deviceBreakdown}
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="count"
                            nameKey="device"
                          >
                            {data.deviceBreakdown.map((entry, index) => (
                              <Cell key={`dev-cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any, _name: any, item: any) => [
                              `${value} sessions (${item.payload.percentage}%)`,
                              item.payload.device
                            ]}
                            contentStyle={{
                              backgroundColor: '#F9F6F0',
                              borderColor: '#d0c8b8',
                              borderRadius: '2px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Device Legend Breakdown List */}
                  <div className="space-y-2 pt-2">
                    {data.deviceBreakdown.map((item) => (
                      <div key={item.device} className="flex items-center justify-between text-xs p-2 rounded-sm bg-stone-50 border border-stone-200">
                        <div className="flex items-center gap-2">
                          {renderDeviceIcon(item.device)}
                          <span className="font-bold text-stone-800">{item.device}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-stone-500">{item.count} sessions</span>
                          <span className="font-bold px-2 py-0.5 rounded-sm text-white text-[11px]" style={{ backgroundColor: item.color }}>
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-stone-200 text-[11px] text-stone-500 text-center">
                  Live traffic tracking active across Mobile, Desktop, and Tablet.
                </div>
              </div>
            </div>

            {/* Bottom Grid: Top Search Queries & Filter Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Search Terms List */}
              <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#C86D51]" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                        Top Search Queries
                      </h3>
                      <p className="text-xs text-stone-500">
                        What prospective travelers and tourists are typing into the search bar.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-sm">
                    {data.kpis.totalSearches} Searches Logged
                  </span>
                </div>

                {data.topSearchTerms.length === 0 ? (
                  <div className="py-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                    <Search className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-stone-600">No search queries recorded yet</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">As visitors query wildlife, parks, and safari styles, terms will show here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {data.topSearchTerms.map((item, idx) => (
                      <div
                        key={item.term}
                        className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-sm border border-stone-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#3A4F41] text-white flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#222222] block">
                              "{item.term}"
                            </span>
                            <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                              Category: {item.category} • Last searched {item.lastSearchedAgo}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#C86D51] bg-[#C86D51]/10 px-2 py-0.5 rounded-sm">
                            {item.count} queries
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Usage Breakdown & Key Intent Segments */}
              <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-[#3A4F41]" />
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                          Filter Usage & Trip Preferences
                        </h3>
                        <p className="text-xs text-stone-500">
                          Most requested duration, style, and accommodation filters.
                        </p>
                      </div>
                    </div>
                  </div>

                  {data.filterUsage.length === 0 ? (
                    <div className="py-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                      <Filter className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-600">No filter selections recorded yet</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">As visitors filter packages by duration and budget, preferences will map here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.filterUsage.map((filter) => (
                        <div key={filter.filterName} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#3A4F41]">{filter.filterName}</span>
                            <span className="text-stone-600">{filter.count} uses ({filter.percentage}%)</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-xs h-2 overflow-hidden">
                            <div
                              className="bg-[#C86D51] h-full rounded-xs transition-all duration-500"
                              style={{ width: `${filter.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conversion Takeaway Strip */}
                <div className="mt-6 p-4 bg-[#3A4F41]/10 border border-[#3A4F41]/20 rounded-sm space-y-1">
                  <span className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider block">
                    Owner Strategic Guidance
                  </span>
                  <p className="text-xs text-stone-700">
                    Live telemetry provides instant conversion rate tracking on WhatsApp inquiries, lodge bookings, safari bookmarking, and visitor traffic patterns.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 3. Outbound Link Audit Table (Full View) */}
        {/* ========================================================= */}
        {data && (activeTab === 'audit' || activeTab === 'overview') && (
          <div className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-[#C86D51]" />
                  <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                    Outbound Referral Link Audit Log
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time audit of all external partner, direct phone, Google Maps, and WhatsApp referral links clicked by prospective tourists.
                </p>
              </div>

              {/* Table Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search attraction, partner, URL..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none w-56"
                  />
                </div>

                {/* Filter Link Type */}
                <select
                  value={auditLinkType}
                  onChange={(e) => setAuditLinkType(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-sm px-3 py-1.5 text-xs text-[#222222] font-bold focus:ring-1 focus:ring-[#C86D51] outline-none cursor-pointer"
                >
                  <option value="All">All Link Types</option>
                  <option value="WhatsApp">WhatsApp Inquiries</option>
                  <option value="Phone">Phone Calls</option>
                  <option value="Directions/Map">Google Maps Directions</option>
                  <option value="Partner Lodge">Partner Lodges</option>
                  <option value="Park Permits">Park Permits (KWS)</option>
                  <option value="Airline">Bush Flights</option>
                </select>

                <button
                  onClick={exportOutboundCSV}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C86D51]" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200">
                    <th className="py-3 px-4">Attraction / Partner Entity</th>
                    <th className="py-3 px-4">Link Category</th>
                    <th className="py-3 px-4">Destination Target URL</th>
                    <th className="py-3 px-4">Device</th>
                    <th className="py-3 px-4">Time Logged</th>
                    <th className="py-3 px-4">Session ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs">
                  {filteredOutboundClicks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-500 font-medium">
                        No outbound referral logs matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOutboundClicks.slice(0, activeTab === 'audit' ? 50 : 10).map((click) => {
                      const dateObj = new Date(click.timestamp);
                      const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <tr key={click.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#3A4F41]">
                            <div className="flex items-center gap-2">
                              <span>{click.entityName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderLinkBadge(click.linkType)}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-stone-600 font-mono text-[11px]">
                            <a
                              href={click.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C86D51] hover:underline flex items-center gap-1"
                              title={click.targetUrl}
                            >
                              <span className="truncate">{click.targetUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-stone-700">
                              {renderDeviceIcon(click.deviceType)}
                              <span className="text-[11px] font-semibold">{click.deviceType}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-stone-600 text-[11px]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>{formattedDate}, {formattedTime}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[10px] text-stone-400">
                            {click.sessionId.substring(0, 14)}...
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {activeTab === 'overview' && filteredOutboundClicks.length > 10 && (
              <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs font-bold text-[#C86D51] hover:text-[#b05a41] uppercase tracking-wider cursor-pointer"
                >
                  View All {filteredOutboundClicks.length} Outbound Clicks in Audit Tab →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. Live Stream Feed (Dedicated Tab) */}
        {/* ========================================================= */}
        {data && activeTab === 'live' && (
          <div className="bg-white rounded-sm border border-stone-300 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                  Real-Time Tourist Interaction Telemetry Stream
                </h3>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed (Auto-updates)
              </span>
            </div>

            {data.recentLiveEvents.length === 0 ? (
              <div className="py-12 text-center bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-700">Awaiting live tourist events</p>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Telemetry stream is actively listening. Visitor clicks, attraction views, and WhatsApp interactions will stream here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentLiveEvents.map((evt) => {
                  const dateObj = new Date(evt.timestamp);
                  const timeStr = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  return (
                    <div
                      key={evt.id}
                      className="p-3 bg-stone-50 rounded-sm border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#C86D51]" />
                        <div>
                          <span className="font-bold text-[#3A4F41] uppercase text-[10px] tracking-wider bg-stone-200 px-2 py-0.5 rounded-xs mr-2">
                            {evt.eventType.replace('_', ' ')}
                          </span>
                          <strong className="text-[#222222]">{evt.entityId}</strong>
                          {evt.metadata?.searchQuery && (
                            <span className="text-stone-500 ml-1">"{evt.metadata.searchQuery}"</span>
                          )}
                          {evt.metadata?.linkType && (
                            <span className="text-purple-700 ml-1 font-semibold">[{evt.metadata.linkType}]</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-stone-500 text-[11px] shrink-0">
                        <div className="flex items-center gap-1">
                          {renderDeviceIcon(evt.deviceType)}
                          <span>{evt.deviceType}</span>
                        </div>
                        <span>{timeStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
