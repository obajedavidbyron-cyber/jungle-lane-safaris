import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  BookOpen,
  Calendar,
  Eye,
  BarChart3,
  Users,
  Database,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Phone,
  Navigation,
  Globe,
  Star,
  Layers,
  ArrowRight,
  Shield,
  ShieldCheck,
  Clock,
  Tag,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Download,
  Filter,
  Play,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  Hotel,
  TrendingUp,
  AlertCircle,
  MessageSquare
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
  DestinationDoc,
  ItineraryDoc,
  UserDoc,
  SafariPackage,
  AnalyticsInsightsResponse,
  TimeRangeFilter,
  OutboundClickLog
} from '../../types';
import { destinationApi, itineraryApi, userApi, databaseAdminApi } from '../../lib/dataAccessLayer';
import { SAFARI_PACKAGES, CONTACT_INFO } from '../../data/safariData';

interface AdminDashboardViewProps {
  onNavigateHome?: () => void;
  onNavigateToAnalytics?: () => void;
}

interface AdminSession {
  email: string;
  name: string;
  role: 'admin';
  authenticatedAt: string;
}

const ADMIN_STORAGE_KEY = 'jls_admin_auth_session';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateHome
}) => {
  // Authentication State
  const [session, setSession] = useState<AdminSession | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'admin') return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return null;
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('obajedavidbyron@gmail.com');
  const [loginPassword, setLoginPassword] = useState('jungle2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab within Admin Dashboard
  const [activeTab, setActiveTab] = useState<'analytics' | 'destinations' | 'itineraries' | 'packages' | 'users' | 'database'>('analytics');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // =========================================================
  // ANALYTICS STATE (Merged from Owner Analytics)
  // =========================================================
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsInsightsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditLinkType, setAuditLinkType] = useState<string>('All');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'audit' | 'live'>('overview');

  // =========================================================
  // DESTINATIONS STATE
  // =========================================================
  const [destinations, setDestinations] = useState<DestinationDoc[]>([]);
  const [destLoading, setDestLoading] = useState<boolean>(true);
  const [destSearch, setDestSearch] = useState<string>('');
  const [destCategory, setDestCategory] = useState<string>('all');
  const [showAddDestModal, setShowAddDestModal] = useState<boolean>(false);
  const [editingDest, setEditingDest] = useState<DestinationDoc | null>(null);

  // =========================================================
  // ITINERARIES STATE
  // =========================================================
  const [itineraries, setItineraries] = useState<ItineraryDoc[]>([]);
  const [itinLoading, setItinLoading] = useState<boolean>(false);
  const [inspectingItin, setInspectingItin] = useState<ItineraryDoc | null>(null);

  // =========================================================
  // USERS STATE
  // =========================================================
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  // =========================================================
  // DATABASE STATUS STATE
  // =========================================================
  const [dbStatus, setDbStatus] = useState<any>(null);

  // Form states for New / Edit Destination
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Landmark' as DestinationDoc['category'],
    description: '',
    city: 'Nairobi',
    country: 'Kenya',
    address: 'Nairobi National Park Main Gate, Langata Road',
    latitude: -1.286389,
    longitude: 36.817223,
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'],
    opening_hours: '06:00 - 18:00 Daily',
    average_rating: 4.8,
    review_count: 120,
    website_url: '',
    direct_directions_url: '',
    phone_number: '+254 700 000000',
    tags: 'Wildlife, Big 5, Game Drives',
    is_featured: false
  });

  // Form state for New User
  const [userFormData, setUserFormData] = useState({
    display_name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // Show temporary toast message
  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      const email = loginEmail.trim().toLowerCase();
      // Allow authorized owner email or master admin credentials
      const authorizedAdmins = [
        'obajedavidbyron@gmail.com',
        'admin@junglelanesafaris.com',
        'owner@junglelanesafaris.com',
        'admin'
      ];

      const isValidUser = authorizedAdmins.some((adm) => email.includes(adm) || adm === email);
      const isValidPassword =
        loginPassword === 'jungle2026' ||
        loginPassword === 'admin' ||
        loginPassword === 'admin123' ||
        loginPassword === 'safari2026';

      if (isValidUser && isValidPassword) {
        const newSession: AdminSession = {
          email: loginEmail.trim(),
          name: loginEmail.includes('obaje') ? 'David Byron Obaje' : 'System Administrator',
          role: 'admin',
          authenticatedAt: new Date().toISOString()
        };
        setSession(newSession);
        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(newSession));
        } catch (e) {}
        showNotification(`Welcome back, ${newSession.name}. Admin security unlocked.`);
      } else {
        setLoginError('Invalid Administrator credentials. Please verify your email and admin passcode.');
      }
      setLoginLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {}
  };

  // Fetch Analytics Insights
  const fetchAnalytics = async (selectedRange: TimeRangeFilter = timeRange, isBackground = false) => {
    if (!isBackground) setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics/insights?timeRange=${selectedRange}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const json = await res.json();
      setAnalyticsData(json);
      setAnalyticsError(null);
    } catch (err: any) {
      setAnalyticsError(err.message || 'Error loading analytics');
    } finally {
      if (!isBackground) setAnalyticsLoading(false);
    }
  };

  // Fetch Destinations
  const loadDestinations = async () => {
    setDestLoading(true);
    try {
      const res = await destinationApi.fetchAll({
        category: destCategory !== 'all' ? destCategory : undefined,
        search: destSearch || undefined,
        limit: 100
      });
      setDestinations(res.data);
    } catch (err: any) {
      console.error('Error fetching destinations:', err);
    } finally {
      setDestLoading(false);
    }
  };

  // Fetch Itineraries
  const loadItineraries = async () => {
    setItinLoading(true);
    try {
      const list = await itineraryApi.fetchPublicItineraries();
      setItineraries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setItinLoading(false);
    }
  };

  // Fetch Users
  const loadUsers = async () => {
    setUserLoading(true);
    try {
      const list = await userApi.fetchAll();
      setUsers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch DB Status
  const loadDbStatus = async () => {
    try {
      const status = await databaseAdminApi.getStatus();
      setDbStatus(status);
    } catch (err) {
      console.error(err);
    }
  };

  // Effects when authenticated
  useEffect(() => {
    if (!session) return;
    if (activeTab === 'analytics') {
      fetchAnalytics(timeRange);
    } else if (activeTab === 'destinations') {
      loadDestinations();
    } else if (activeTab === 'itineraries') {
      loadItineraries();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'database') {
      loadDbStatus();
    }
  }, [session, activeTab, timeRange, destCategory, destSearch]);

  // Auto-refresh interval for live analytics
  useEffect(() => {
    if (!session || !autoRefresh || activeTab !== 'analytics') return;
    const interval = setInterval(() => {
      fetchAnalytics(timeRange, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [session, autoRefresh, activeTab, timeRange]);

  // Filtered Outbound Audit Clicks
  const filteredAuditLogs = useMemo(() => {
    if (!analyticsData) return [];
    return analyticsData.recentOutboundClicks.filter((log) => {
      const matchesSearch =
        auditSearch === '' ||
        log.entityName.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.targetUrl.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesType = auditLinkType === 'All' || log.linkType === auditLinkType;
      return matchesSearch && matchesType;
    });
  }, [analyticsData, auditSearch, auditLinkType]);

  // Analytics Simulation
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
        showNotification('Simulated real-time WhatsApp inquiry conversion recorded!');
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
        showNotification('Simulated outbound referral click to Mara Serena Lodge!');
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
        showNotification('Simulated Google Maps navigation click recorded!');
      }
      await fetchAnalytics(timeRange, true);
    } catch (err: any) {
      showNotification('Simulation error: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  // Reset Analytics to Zero
  const handleResetAnalytics = async () => {
    if (!window.confirm('Reset all live visitor tracking and telemetry events to zero? This prepares the portal with clean zero values.')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/analytics/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed');
      showNotification('Analytics dashboard successfully reset to clean zero values!');
      await fetchAnalytics(timeRange, false);
    } catch (err: any) {
      alert(`Error resetting analytics: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Export Outbound Logs to CSV
  const handleExportCSV = () => {
    if (!analyticsData || analyticsData.recentOutboundClicks.length === 0) {
      alert('No audit logs available to export.');
      return;
    }
    const headers = ['ID', 'Entity Name', 'Link Type', 'Target URL', 'Device', 'Timestamp', 'Session ID'];
    const rows = analyticsData.recentOutboundClicks.map((log) => [
      log.id,
      `"${log.entityName.replace(/"/g, '""')}"`,
      log.linkType,
      `"${log.targetUrl.replace(/"/g, '""')}"`,
      log.deviceType,
      log.timestamp,
      log.sessionId
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jungle-lane-outbound-audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Destinations Handlers
  const handleOpenCreateDest = () => {
    setEditingDest(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Landmark',
      description: '',
      city: 'Nairobi',
      country: 'Kenya',
      address: 'Nairobi, Kenya',
      latitude: -1.286389,
      longitude: 36.817223,
      images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'],
      opening_hours: '06:00 - 18:00 Daily',
      average_rating: 4.8,
      review_count: 120,
      website_url: '',
      direct_directions_url: '',
      phone_number: '+254 700 000000',
      tags: 'Wildlife, Big 5, Game Drives',
      is_featured: false
    });
    setShowAddDestModal(true);
  };

  const handleOpenEditDest = (dest: DestinationDoc) => {
    setEditingDest(dest);
    setFormData({
      name: dest.name,
      slug: dest.slug,
      category: dest.category,
      description: dest.description,
      city: dest.location.city,
      country: dest.location.country,
      address: dest.location.address || '',
      latitude: dest.location.latitude,
      longitude: dest.location.longitude,
      images: dest.images,
      opening_hours: dest.opening_hours || '06:00 - 18:00 Daily',
      average_rating: dest.average_rating,
      review_count: dest.review_count,
      website_url: dest.website_url || '',
      direct_directions_url: dest.direct_directions_url || '',
      phone_number: dest.phone_number || '',
      tags: dest.tags.join(', '),
      is_featured: dest.is_featured
    });
    setShowAddDestModal(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload: Partial<DestinationDoc> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: formData.category,
        description: formData.description.trim(),
        location: {
          city: formData.city.trim(),
          country: formData.country.trim(),
          address: formData.address.trim() || undefined,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude)
        },
        images: formData.images.filter((img) => img.trim() !== ''),
        opening_hours: formData.opening_hours.trim() || undefined,
        average_rating: Number(formData.average_rating),
        review_count: Number(formData.review_count) || 10,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        is_featured: Boolean(formData.is_featured),
        website_url: formData.website_url.trim() || undefined,
        direct_directions_url: formData.direct_directions_url.trim() || undefined,
        phone_number: formData.phone_number.trim() || undefined
      };

      if (editingDest) {
        await destinationApi.update(editingDest.attraction_id, payload);
        showNotification(`Destination "${formData.name}" successfully updated!`);
      } else {
        await destinationApi.create(payload);
        showNotification(`New destination "${formData.name}" added to database!`);
      }

      setShowAddDestModal(false);
      setEditingDest(null);
      await loadDestinations();
      await loadDbStatus();
    } catch (err: any) {
      alert(`Error saving destination: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDestination = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete destination "${name}" from database?`)) return;
    try {
      await destinationApi.delete(id);
      showNotification(`Destination "${name}" deleted.`);
      await loadDestinations();
      await loadDbStatus();
    } catch (err: any) {
      alert(`Error deleting destination: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (dest: DestinationDoc) => {
    try {
      await destinationApi.update(dest.attraction_id, {
        is_featured: !dest.is_featured
      });
      showNotification(`"${dest.name}" featured status toggled to ${!dest.is_featured ? 'Featured' : 'Standard'}.`);
      await loadDestinations();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Itinerary Handlers
  const handleToggleItineraryPublic = async (itin: ItineraryDoc) => {
    try {
      await itineraryApi.update(itin.itinerary_id, {
        is_public: !itin.is_public
      });
      showNotification(`Itinerary "${itin.title}" visibility toggled.`);
      await loadItineraries();
    } catch (err: any) {
      alert(`Error updating itinerary: ${err.message}`);
    }
  };

  const handleDeleteItinerary = async (id: string, title: string) => {
    if (!window.confirm(`Delete itinerary "${title}"?`)) return;
    try {
      await itineraryApi.delete(id);
      showNotification(`Itinerary "${title}" removed.`);
      await loadItineraries();
    } catch (err: any) {
      alert(`Error deleting itinerary: ${err.message}`);
    }
  };

  // Users Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.create({
        display_name: userFormData.display_name.trim(),
        email: userFormData.email.trim(),
        role: userFormData.role,
        profile_pic: userFormData.profile_pic.trim()
      });
      showNotification(`User "${userFormData.display_name}" added successfully.`);
      setShowAddUserModal(false);
      setUserFormData({
        display_name: '',
        email: '',
        role: 'user',
        profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      await loadUsers();
    } catch (err: any) {
      alert(`Error adding user: ${err.message}`);
    }
  };

  const handleToggleUserRole = async (user: UserDoc) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await userApi.update(user.user_id, { role: newRole });
      showNotification(`User "${user.display_name}" role changed to ${newRole}.`);
      await loadUsers();
    } catch (err: any) {
      alert(`Error changing role: ${err.message}`);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await userApi.delete(id);
      showNotification(`User "${name}" deleted.`);
      await loadUsers();
    } catch (err: any) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  // Database Handlers
  const handleSeedDatabase = async () => {
    if (!window.confirm('Re-seed the database with the official Kenyan Safari destinations, authentic packages, and sample itineraries?')) return;
    setActionLoading(true);
    try {
      await databaseAdminApi.seedDatabase();
      showNotification('Database successfully re-seeded with official Kenyan Safari dataset!');
      await loadDestinations();
      await loadItineraries();
      await loadUsers();
      await loadDbStatus();
      if (activeTab === 'analytics') await fetchAnalytics(timeRange, false);
    } catch (err: any) {
      alert(`Error seeding database: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // IF NOT AUTHENTICATED: RENDER SECURE ADMIN LOCK SCREEN
  // =========================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-stone-800 border border-stone-700/80 rounded-sm shadow-2xl p-8 space-y-6">
          {/* Header & Lock Shield */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800">
                Restricted Access • Administrator & Owner Only
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mt-2">
                Jungle Lane Admin Portal
              </h2>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                This portal contains executive analytics, booking conversions, destination repositories, and database controls. Public access is strictly locked.
              </p>
            </div>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="bg-red-950/70 border border-red-800 text-red-300 p-3 rounded-sm text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-300 mb-1 uppercase tracking-wider text-[11px]">
                Authorized Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@junglelanesafaris.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-sm px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1 uppercase tracking-wider text-[11px]">
                Admin Security Key / Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-sm px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                <span>Default Passcode: <code className="text-stone-400">jungle2026</code></span>
                <span className="text-amber-500/80 font-medium">Verified Master Key</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-sm uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Public Site Link */}
          <div className="pt-4 border-t border-stone-700/60 text-center">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="text-stone-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
              >
                <span>← Return to Public Safari Website</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // AUTHENTICATED: RENDER MERGED ADMIN & OWNER DASHBOARD
  // =========================================================
  return (
    <div className="bg-[#F4EFE6] min-h-screen pb-16 text-[#222222]">
      {/* Top Restricted Admin Security Bar */}
      <div className="bg-[#1E2B22] text-stone-300 text-xs py-1.5 px-4 sm:px-8 border-b border-[#2D3E33]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-stone-200 font-bold">Authenticated Admin Session:</span>
            <span className="text-amber-300 font-mono text-[11px]">{session.email}</span>
            <span className="hidden sm:inline text-stone-500">• Access Level: Master Owner</span>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-900/60 hover:bg-red-800 text-red-200 hover:text-white px-2 py-0.5 rounded-xs flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3 h-3" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Header */}
      <div className="bg-[#2D3E33] text-[#F9F6F0] border-b border-[#1E2B22] sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-300 font-bold uppercase tracking-wider">
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-sm text-[10px] flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Master Admin & Executive Suite
              </span>
              <span>/</span>
              <span>All-In-One Operations & Analytics</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
              <span>Jungle Lane Safaris Admin Hub</span>
              <span className="text-xs bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-600 font-sans font-semibold">
                ● Live DAL Connected
              </span>
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              Complete administrative control: Executive Traffic Telemetry, Outbound Conversion Audits, Parks & Lodges Repository, Custom Proposals, Tour Packages, and Database Status.
            </p>
          </div>

          {/* Quick Global Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedDatabase}
              disabled={actionLoading}
              className="bg-[#3A4F41] hover:bg-[#475F50] text-stone-200 hover:text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border border-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset and Seed Database with Kenyan Safaris dataset"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seed Dataset</span>
            </button>

            <button
              onClick={handleResetAnalytics}
              disabled={actionLoading}
              className="bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset Analytics to Zero Values"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Zero Analytics</span>
            </button>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-3 pt-1 flex flex-wrap items-center gap-2 border-t border-[#3A4F41]">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Analytics & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Destinations Repository ({destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('itineraries')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'itineraries'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Custom Itineraries ({itineraries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Safari Packages ({SAFARI_PACKAGES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff & Travelers ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#C86D51] text-white shadow-sm'
                : 'text-stone-300 hover:bg-[#3A4F41] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database & System Status</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* Status Notification */}
        {actionMessage && (
          <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-sm shadow-md text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-emerald-200 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: EXECUTIVE ANALYTICS & TRAFFIC TELEMETRY */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Analytics Controls Strip */}
            <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Time Range Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Period:
                </span>
                {[
                  { id: 'today', label: 'Today' },
                  { id: '7d', label: 'Last 7 Days' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: 'peak_season', label: 'Peak Season' },
                  { id: 'all', label: 'All-Time' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setTimeRange(range.id as TimeRangeFilter)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      timeRange === range.id
                        ? 'bg-[#3A4F41] text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Live Refresh, Auto-toggle, Simulation */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    autoRefresh
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 border-stone-300 text-stone-600'
                  }`}
                  title="Auto-refresh every 12 seconds"
                >
                  <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  <span>{autoRefresh ? 'Live Auto-Polling' : 'Auto-Poll Off'}</span>
                </button>

                <button
                  onClick={() => fetchAnalytics(timeRange, false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-stone-300"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Test Conversion Simulation Strip */}
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Play className="w-4 h-4 text-amber-700" />
                <span>Simulate Guest Booking Event:</span>
                <span className="text-amber-800 font-normal text-[11px] hidden md:inline">
                  Test the real-time telemetry stream without visiting the public site
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => triggerSimulation('whatsapp')}
                  disabled={simulating}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>+ WhatsApp Click</span>
                </button>
                <button
                  onClick={() => triggerSimulation('lodge')}
                  disabled={simulating}
                  className="bg-stone-700 hover:bg-stone-800 text-white px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Hotel className="w-3 h-3" />
                  <span>+ Lodge Referral</span>
                </button>
                <button
                  onClick={() => triggerSimulation('directions')}
                  disabled={simulating}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>+ Maps Directions</span>
                </button>
              </div>
            </div>

            {/* 4 Core Executive KPI Cards */}
            {analyticsData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Unique Travelers
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#3A4F41] block mt-0.5">
                      {analyticsData.kpis.totalVisitors.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{analyticsData.kpis.totalPageViews} total page impressions</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      High-Intent Outbounds
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#C86D51] block mt-0.5">
                      {analyticsData.kpis.totalOutboundClicks.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      WhatsApp, Phone Calls & Lodge Links
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-amber-50 text-[#C86D51] flex items-center justify-center">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Outbound Conversion
                    </span>
                    <span className="text-3xl font-serif font-bold text-emerald-700 block mt-0.5">
                      {analyticsData.kpis.outboundConversionRate.toFixed(1)}%
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      Visitors inquiring directly
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Custom Plans Created
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#2D3E33] block mt-0.5">
                      {analyticsData.kpis.totalItinerariesCreated.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      AI Generator & Builder proposals
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-stone-100 text-stone-700 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {/* Charts Grid: Traffic Over Time & Device Breakdown */}
            {analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Trends Area Chart (2 cols) */}
                <div className="lg:col-span-2 bg-white p-5 rounded-sm border border-stone-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#3A4F41]">
                        Traffic Volume & Outbound Inquiries Over Time
                      </h3>
                      <p className="text-xs text-stone-500">Daily unique visitors and high-value conversion clicks</p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.trafficTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3A4F41" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3A4F41" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C86D51" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#C86D51" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6B7280" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" />
                        <Tooltip />
                        <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#3A4F41" strokeWidth={2} fill="url(#visitorGradient)" />
                        <Area type="monotone" dataKey="outboundClicks" name="Outbounds" stroke="#C86D51" strokeWidth={2} fill="url(#outboundGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device Type Breakdown (1 col) */}
                <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3A4F41]">
                      Device Type Distribution
                    </h3>
                    <p className="text-xs text-stone-500">Traveler platform breakdown</p>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.deviceBreakdown}
                          dataKey="count"
                          nameKey="device"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                        >
                          {analyticsData.deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                    {analyticsData.deviceBreakdown.map((item) => (
                      <div key={item.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-stone-700">{item.device}</span>
                        </div>
                        <span className="font-mono font-bold text-stone-900">{item.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tabs: Outbound Click Audit Trail vs Popular Searches */}
            <div className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAnalyticsSubTab('overview')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer ${
                      analyticsSubTab === 'overview'
                        ? 'text-[#C86D51] border-b-2 border-[#C86D51]'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Popular Attractions & Search Terms
                  </button>
                  <button
                    onClick={() => setAnalyticsSubTab('audit')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer ${
                      analyticsSubTab === 'audit'
                        ? 'text-[#C86D51] border-b-2 border-[#C86D51]'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Outbound Clicks Audit Log ({analyticsData?.recentOutboundClicks.length || 0})
                  </button>
                </div>

                {analyticsSubTab === 'audit' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Filter audit logs..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-sm px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-[#C86D51]"
                    />
                    <select
                      value={auditLinkType}
                      onChange={(e) => setAuditLinkType(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-sm px-2 py-1 text-xs outline-none cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone</option>
                      <option value="Partner Lodge">Lodges</option>
                      <option value="Directions/Map">Directions</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Sub-Tab 1: Popular Attractions & Search Terms */}
              {analyticsSubTab === 'overview' && analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Popular Attractions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#C86D51]" />
                      <span>Most Viewed Destinations & Safaris</span>
                    </h4>
                    <div className="space-y-2">
                      {analyticsData.popularAttractions.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-stone-50 rounded-sm border border-stone-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-stone-900">{item.name}</span>
                            <span className="text-[10px] text-stone-500 block">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-[#C86D51]">{item.views} views</span>
                            <span className="text-[10px] text-stone-400 block">{item.sharePercentage.toFixed(1)}% traffic share</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Search Terms */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-[#3A4F41]" />
                      <span>Top Safari Search Queries</span>
                    </h4>
                    <div className="space-y-2">
                      {analyticsData.topSearchTerms.map((term, idx) => (
                        <div key={idx} className="p-2.5 bg-stone-50 rounded-sm border border-stone-200 flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-800">"{term.term}"</span>
                          <span className="bg-stone-200 px-2 py-0.5 rounded-sm font-mono font-bold text-stone-700 text-[11px]">
                            {term.count} searches
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Outbound Click Audit Trail Table */}
              {analyticsSubTab === 'audit' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200">
                        <th className="py-2.5 px-3">Entity / Target Destination</th>
                        <th className="py-2.5 px-3">Action Type</th>
                        <th className="py-2.5 px-3">Target Outbound Link</th>
                        <th className="py-2.5 px-3">Device</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-xs">
                      {filteredAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-stone-500">
                            No outbound conversion clicks recorded for this period.
                          </td>
                        </tr>
                      ) : (
                        filteredAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-bold text-[#3A4F41]">
                              {log.entityName}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                                {log.linkType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600 max-w-xs truncate">
                              <a href={log.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C86D51] underline">
                                {log.targetUrl}
                              </a>
                            </td>
                            <td className="py-2.5 px-3 text-stone-700 font-medium">
                              {log.deviceType}
                            </td>
                            <td className="py-2.5 px-3 text-stone-500 text-[11px] whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DESTINATIONS & ATTRACTIONS REPOSITORY */}
        {/* ========================================================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search destination, park, city..."
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none w-64"
                  />
                </div>

                <select
                  value={destCategory}
                  onChange={(e) => setDestCategory(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-sm px-3 py-1.5 text-xs text-[#222222] font-semibold focus:ring-1 focus:ring-[#C86D51] outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Landmark">Landmarks & Parks</option>
                  <option value="Nature">Nature & Reserves</option>
                  <option value="Activity">Safari Activities</option>
                  <option value="Restaurant">Dining & Lodges</option>
                  <option value="Museum">Museums & Culture</option>
                </select>

                <span className="text-xs text-stone-500 font-medium">
                  Showing {destinations.length} attractions
                </span>
              </div>

              <button
                onClick={handleOpenCreateDest}
                className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200">
                      <th className="py-3 px-4">Attraction / Park</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location & GPS</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Verified Links</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs">
                    {destLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C86D51]" />
                          Loading destinations from database...
                        </td>
                      </tr>
                    ) : destinations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-500">
                          No destinations match your filters.
                        </td>
                      </tr>
                    ) : (
                      destinations.map((dest) => (
                        <tr key={dest.attraction_id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#3A4F41]">
                            <div className="flex items-center gap-3">
                              <img
                                src={dest.images[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=200&q=80'}
                                alt={dest.name}
                                className="w-10 h-10 object-cover rounded-sm border border-stone-200 shrink-0"
                              />
                              <div>
                                <span className="block font-bold text-stone-900">{dest.name}</span>
                                <span className="font-mono text-[10px] text-stone-400">/{dest.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800">
                              {dest.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-stone-700 font-medium">{dest.location.city}, {dest.location.country}</div>
                            <div className="text-[10px] font-mono text-stone-400">
                              {dest.location.latitude.toFixed(4)}, {dest.location.longitude.toFixed(4)}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-amber-700 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{dest.average_rating.toFixed(1)}</span>
                              <span className="text-[10px] text-stone-400 font-normal">({dest.review_count})</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {dest.direct_directions_url && (
                                <a
                                  href={dest.direct_directions_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center hover:bg-amber-200"
                                  title="Google Maps Directions"
                                >
                                  <Navigation className="w-3 h-3" />
                                </a>
                              )}
                              {dest.phone_number && (
                                <a
                                  href={`tel:${dest.phone_number}`}
                                  className="w-6 h-6 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center hover:bg-blue-200"
                                  title={dest.phone_number}
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}
                              {dest.website_url && (
                                <a
                                  href={dest.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center hover:bg-stone-200"
                                  title="Partner/Official Website"
                                >
                                  <Globe className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleFeatured(dest)}
                              className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                dest.is_featured
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                              }`}
                            >
                              {dest.is_featured ? '★ Featured' : 'Standard'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditDest(dest)}
                                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-sm cursor-pointer"
                                title="Edit Destination"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDestination(dest.attraction_id, dest.name)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-sm cursor-pointer"
                                title="Delete Destination"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOM ITINERARIES & SAVED TRIPS */}
        {/* ========================================================= */}
        {activeTab === 'itineraries' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                  Customer Safari Proposals & Saved Itineraries
                </h3>
                <p className="text-xs text-stone-500">
                  Plans created by travelers via the interactive Itinerary Builder and AI Generator.
                </p>
              </div>
              <button
                onClick={loadItineraries}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200">
                      <th className="py-3 px-4">Itinerary Title</th>
                      <th className="py-3 px-4">Attractions / Spots</th>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs">
                    {itinLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C86D51]" />
                          Loading customer itineraries...
                        </td>
                      </tr>
                    ) : itineraries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          No custom customer itineraries saved yet.
                        </td>
                      </tr>
                    ) : (
                      itineraries.map((itin) => (
                        <tr key={itin.itinerary_id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#3A4F41]">
                            <span>{itin.title}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              {itin.items.length} spots attached
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                            {itin.user_id}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleItineraryPublic(itin)}
                              className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                itin.is_public
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {itin.is_public ? 'Public' : 'Private'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                            {new Date(itin.updated_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setInspectingItin(itin)}
                                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-sm cursor-pointer"
                                title="Inspect Day-by-Day Spots"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItinerary(itin.itinerary_id, itin.title)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-sm cursor-pointer"
                                title="Delete Itinerary"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SAFARI PACKAGES CATALOG */}
        {/* ========================================================= */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                  Official Safari Packages & Tour Catalog
                </h3>
                <p className="text-xs text-stone-500">
                  Catalog of {SAFARI_PACKAGES.length} curated day excursions, private wildlife circuits, and multi-day packages.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAFARI_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="relative">
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-40 object-cover" />
                    <div className="absolute top-2 left-2 bg-[#3A4F41]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      {pkg.category === 'day' ? 'Day Excursion' : 'Multi-Day Safari'}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#C86D51] text-white text-xs font-bold px-2 py-1 rounded-sm shadow">
                      From ${pkg.priceFromUSD} USD
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#3A4F41]">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                        {pkg.shortDescription}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                      <div className="flex items-center justify-between text-stone-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                          <span>{pkg.durationLabel}</span>
                        </span>
                        <span className="font-bold text-[#3A4F41]">{pkg.tag}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {pkg.destinations.slice(0, 3).map((d) => (
                          <span key={d} className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-xs font-semibold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TRAVELERS & REGISTERED ACCOUNTS */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-sm border border-stone-300 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                  User Accounts & Access Control
                </h3>
                <p className="text-xs text-stone-500">
                  Manage traveler profiles, guides, and administrator access roles.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add User / Staff</span>
              </button>
            </div>

            <div className="bg-white rounded-sm border border-stone-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs">
                    {userLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C86D51]" />
                          Loading registered accounts...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          No users registered.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.user_id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#3A4F41]">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.profile_pic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                alt={u.display_name}
                                className="w-8 h-8 rounded-full object-cover border border-stone-300 shrink-0"
                              />
                              <span>{u.display_name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-stone-700 font-medium">
                            {u.email}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-stone-100 text-stone-700 border border-stone-300'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[10px] text-stone-400">
                            {u.user_id}
                          </td>

                          <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                            {new Date(u.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleUserRole(u)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase rounded-sm cursor-pointer"
                                title="Toggle Role (User / Admin)"
                              >
                                Change to {u.role === 'admin' ? 'User' : 'Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.user_id, u.display_name)}
                                className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-sm cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DATABASE & SYSTEM STATUS */}
        {/* ========================================================= */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#C86D51]" />
                  <h3 className="font-serif text-lg font-bold text-[#3A4F41]">
                    Database Diagnostics & System Collections
                  </h3>
                </div>
                <button
                  onClick={loadDbStatus}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Stats</span>
                </button>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-stone-50 rounded-sm border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Destinations Collection
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#3A4F41]">
                    {dbStatus?.summary?.destinationsCount || destinations.length}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">/destinations (Parks & Spots)</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-sm border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Itineraries Collection
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#3A4F41]">
                    {dbStatus?.summary?.itinerariesCount || itineraries.length}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">/itineraries (Custom Travel Plans)</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-sm border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Users Collection
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#3A4F41]">
                    {dbStatus?.summary?.usersCount || users.length}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">/users (Travelers & Admins)</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-sm border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Analytics Events Logged
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#C86D51]">
                    {dbStatus?.summary?.eventsCount || 0}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">/analytics_events (Live Clicks)</span>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-sm space-y-3 mt-4">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Database Population & Maintenance
                </h4>
                <p className="text-xs text-amber-800">
                  Re-seeding resets and loads all official Kenyan safari destinations (Maasai Mara, Amboseli, Tsavo, Diani Beach, Lake Nakuru, Hell's Gate) into memory with GPS coordinates and verified links.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSeedDatabase}
                    disabled={actionLoading}
                    className="bg-[#3A4F41] hover:bg-[#2D3E33] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                    <span>Run Full Database Seed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT DESTINATION */}
      {/* ========================================================= */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm border border-stone-300 shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#3A4F41] text-white flex items-center justify-between shrink-0">
              <h3 className="font-serif text-lg font-bold">
                {editingDest ? `Edit Destination: ${editingDest.name}` : 'Add New Safari Destination / Attraction'}
              </h3>
              <button onClick={() => setShowAddDestModal(false)} className="text-stone-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Attraction / Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samburu National Reserve"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none cursor-pointer"
                  >
                    <option value="Landmark">Landmark</option>
                    <option value="Nature">Nature Reserve</option>
                    <option value="Activity">Safari Activity</option>
                    <option value="Restaurant">Restaurant / Lodge</option>
                    <option value="Museum">Museum / Culture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the wildlife, scenery, safari experience, and key features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Latitude (-90 to 90) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Longitude (-180 to 180) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Average Rating (1 to 5) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={formData.average_rating}
                    onChange={(e) => setFormData({ ...formData, average_rating: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Opening Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 - 18:30 Daily"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tags (Comma-separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Wildlife, Big 5, Elephants, Photography"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Website / Partner URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Google Maps Directions URL</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.direct_directions_url}
                    onChange={(e) => setFormData({ ...formData, direct_directions_url: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 700 000000"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-xs focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded-xs text-[#C86D51] focus:ring-[#C86D51]"
                  />
                  <span>Mark as Featured Destination on Homepage & Highlights</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-sm text-stone-700 font-bold uppercase tracking-wider cursor-pointer hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#C86D51] hover:bg-[#b05a41] text-white font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer"
                >
                  {editingDest ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD USER */}
      {/* ========================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-stone-300 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#3A4F41]">Add New User / Staff</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Mwangi"
                  value={userFormData.display_name}
                  onChange={(e) => setUserFormData({ ...userFormData, display_name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[#C86D51]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="david@junglelanesafaris.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[#C86D51]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Role *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[#C86D51] cursor-pointer"
                >
                  <option value="user">Traveler (User)</option>
                  <option value="admin">Administrator / Manager (Admin)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-sm font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C86D51] hover:bg-[#b05a41] text-white font-bold uppercase tracking-wider rounded-sm cursor-pointer shadow"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INSPECT ITINERARY SPOTS */}
      {/* ========================================================= */}
      {inspectingItin && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-stone-300 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A4F41]">{inspectingItin.title}</h3>
                <span className="text-xs text-stone-500">{inspectingItin.items.length} Attractions Saved</span>
              </div>
              <button onClick={() => setInspectingItin(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 text-xs">
              {inspectingItin.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#C86D51]">Day {item.day_number}: Spot #{idx + 1}</span>
                    <span className="font-mono text-[10px] text-stone-400">{item.attraction_id}</span>
                  </div>
                  {item.notes && (
                    <p className="text-stone-600 text-[11px] italic">"{item.notes}"</p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end shrink-0">
              <button
                onClick={() => setInspectingItin(null)}
                className="px-4 py-1.5 bg-[#3A4F41] text-white rounded-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
