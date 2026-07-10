import { useState, useEffect, useCallback } from 'react';
import {
  BarChart2, Flame, RotateCcw, AlertCircle, Trash2,
  ClipboardList, Users, TrendingUp, Loader2, Search, X,
} from 'lucide-react';
import { adminGetAllStreaks, adminResetStreak } from '../../../shared/apis/streak';
import {
  adminGetAllMoodEntries,
  adminDeleteMoodEntry,
  adminGetAllProfiles,
  adminResetUserProfile,
  adminGetSystemStats,
} from '../../../shared/apis/mood';
import toast from 'react-hot-toast';

// ── helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const MOOD_BADGE = {
  FELIZ:       'bg-green-100 text-green-700',
  TRISTE:      'bg-indigo-100 text-indigo-700',
  ANSIOSO:     'bg-orange-100 text-orange-700',
  ENOJADO:     'bg-red-100 text-red-700',
  CALMADO:     'bg-teal-100 text-teal-700',
  NEUTRAL:     'bg-gray-100 text-gray-700',
  EMOCIONADO:  'bg-yellow-100 text-yellow-700',
  FRUSTRADO:   'bg-rose-100 text-rose-700',
  ABRUMADO:    'bg-purple-100 text-purple-700',
  ESPERANZADO: 'bg-cyan-100 text-cyan-700',
  MELANCOLICO: 'bg-blue-100 text-blue-700',
  SATISFECHO:  'bg-lime-100 text-lime-700',
  DESMOTIVADO: 'bg-slate-100 text-slate-700',
  PREOCUPADO:  'bg-amber-100 text-amber-700',
  AGOTADO:     'bg-stone-100 text-stone-700',
};

const PROFILE_LABEL = {
  ALEGRE:                   'Alegre',
  NEUTRAL:                  'Neutral',
  PROBLEMA_DE_ANSIEDAD:     'Ansiedad',
  PROBLEMA_DE_TRISTEZA:     'Tristeza',
  PROBLEMA_DE_IRA:          'Manejo de ira',
  PROBLEMA_DE_CULPABILIDAD: 'Culpabilidad',
  AMOROSO:                  'Amoroso',
  PROBLEMA_DE_DISOSACION:   'Disociación',
  PROBLEMA_DE_AISLAMIENTO:  'Aislamiento',
  SIN_PERFIL:               'Sin perfil',
};

// ── Tarjetas de estadísticas reales ─────────────────────────────────────────

const StatsCards = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetSystemStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!stats) return null;

  const cards = [
    { label: 'Total registros',    value: stats.totalEntries,  icon: BarChart2,     color: 'bg-indigo-50 text-indigo-500' },
    { label: 'Usuarios con racha', value: stats.totalStreaks,  icon: Flame,         color: 'bg-orange-50 text-orange-500' },
    { label: 'Perfiles generados', value: stats.totalProfiles, icon: ClipboardList, color: 'bg-purple-50 text-purple-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-gray-800 m-0">{value?.toLocaleString() ?? '—'}</p>
            <p className="text-xs text-gray-500 font-semibold m-0">{label}</p>
          </div>
        ))}
      </div>

      {/* Top emociones */}
      {stats.topEmotions?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Top emociones registradas</p>
          <div className="flex flex-col gap-2">
            {stats.topEmotions.map((e) => {
              const pct = stats.totalEntries > 0 ? Math.round((e.count / stats.totalEntries) * 100) : 0;
              return (
                <div key={e._id} className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${MOOD_BADGE[e._id] ?? 'bg-gray-100 text-gray-600'}`}>
                    {e._id}
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-10 text-right">{e.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sección: Registros de ánimo ──────────────────────────────────────────────

const MoodEntriesSection = () => {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deletingId, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [userId, setUserId]       = useState('');
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');

  // Mapa userId → username cargado desde rachas
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    adminGetAllStreaks()
      .then(({ data }) => {
        const map = {};
        (data.data ?? []).forEach((s) => {
          if (s.userId) map[s.userId] = s.username || s.userId;
        });
        setUserMap(map);
      })
      .catch(() => {});
  }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (userId.trim()) params.userId = userId.trim();
      if (from) params.from = from;
      if (to)   params.to   = to;
      const { data } = await adminGetAllMoodEntries(params);
      setEntries(data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los registros');
    } finally {
      setLoading(false);
    }
  }, [userId, from, to]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleDelete = async (id) => {
    setDeleting(id);
    setConfirmId(null);
    try {
      await adminDeleteMoodEntry(id);
      toast.success('Registro eliminado');
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const clearFilters = () => { setUserId(''); setFrom(''); setTo(''); };

  const displayUser = (uid) => {
    const name = userMap[uid];
    if (name && name !== uid) return `@${name}`;
    return uid ? `${uid.slice(0, 8)}…` : '—';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-indigo-400" />
          <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase m-0">
            Registros de ánimo
          </h3>
          <span className="text-xs bg-indigo-50 text-indigo-500 font-bold px-2 py-0.5 rounded-full">
            {entries.length}
          </span>
        </div>
        <button onClick={fetchEntries} disabled={loading}
          className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer border-none bg-transparent">
          <RotateCcw size={12} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 px-5 py-3 border-b border-gray-50 flex-wrap items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-400">Usuario (userId)</label>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input value={userId} onChange={(e) => setUserId(e.target.value)}
              placeholder="Filtrar por userId..."
              className="w-full pl-7 pr-3 h-8 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:border-indigo-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400">Desde</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="h-8 border border-gray-200 rounded-lg px-2 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-400 cursor-pointer" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400">Hasta</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="h-8 border border-gray-200 rounded-lg px-2 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-400 cursor-pointer" />
        </div>
        {(userId || from || to) && (
          <button onClick={clearFilters}
            className="h-8 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer bg-white flex items-center gap-1">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-indigo-400" />
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center gap-2 p-5 text-red-500">
          <AlertCircle size={16} /><span className="text-sm">{error}</span>
        </div>
      )}
      {!loading && !error && entries.length === 0 && (
        <p className="text-sm text-gray-400 p-5 text-center">No hay registros con los filtros actuales.</p>
      )}

      {/* Tabla */}
      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Usuario', 'Emoción', 'Intensidad', 'Nota', 'Fecha', 'Acción'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[140px] truncate">
                    {displayUser(e.userId)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${MOOD_BADGE[e.emotion] ?? 'bg-gray-100 text-gray-600'}`}>
                      {e.emotion}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">{e.intensity} / 10</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[180px] truncate italic">
                    {e.note || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(e.date)}</td>
                  <td className="px-4 py-3">
                    {confirmId === e._id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">¿Eliminar?</span>
                        <button onClick={() => handleDelete(e._id)} disabled={deletingId === e._id}
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 font-semibold cursor-pointer border-none">
                          {deletingId === e._id ? '...' : 'Sí'}
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 font-semibold cursor-pointer border-none">
                          No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(e._id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold cursor-pointer bg-white">
                        <Trash2 size={12} /> Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Sección: Rachas ──────────────────────────────────────────────────────────

const StreaksSection = () => {
  const [streaks, setStreaks]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [resetting, setResetting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchStreaks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminGetAllStreaks();
      setStreaks(data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las rachas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStreaks(); }, [fetchStreaks]);

  const handleReset = async (userId) => {
    setResetting(userId);
    setConfirmId(null);
    try {
      await adminResetStreak(userId);
      toast.success('Racha reseteada');
      setStreaks((prev) =>
        prev.map((s) => s.userId === userId ? { ...s, currentStreak: 0, lastRegisteredAt: null } : s)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al resetear la racha');
    } finally {
      setResetting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-orange-400" />
          <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase m-0">Rachas de usuarios</h3>
          <span className="text-xs bg-orange-50 text-orange-500 font-bold px-2 py-0.5 rounded-full">{streaks.length}</span>
        </div>
        <button onClick={fetchStreaks} disabled={loading}
          className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer border-none bg-transparent">
          <RotateCcw size={12} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {loading && <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-orange-400" /></div>}
      {!loading && error && <div className="flex items-center gap-2 p-5 text-red-500"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
      {!loading && !error && streaks.length === 0 && <p className="text-sm text-gray-400 p-5">No hay rachas registradas aún.</p>}

      {!loading && !error && streaks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Usuario', 'Racha actual', 'Racha máx.', 'Último registro', 'Acción'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {streaks.map((s) => (
                <tr key={s.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="m-0 font-bold text-xs text-gray-700">
                      {s.username ? `@${s.username}` : `${(s.userId || '').slice(0, 8)}…`}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Flame size={13} className={s.currentStreak > 0 ? 'text-orange-400' : 'text-gray-300'} />
                      <span className={`font-bold ${s.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {s.currentStreak} días
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-semibold">{s.maxStreak} días</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(s.lastRegisteredAt)}</td>
                  <td className="px-4 py-3">
                    {confirmId === s.userId ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">¿Resetear?</span>
                        <button onClick={() => handleReset(s.userId)} disabled={resetting === s.userId}
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 font-semibold cursor-pointer border-none">
                          {resetting === s.userId ? '...' : 'Sí'}
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 font-semibold cursor-pointer border-none">
                          No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(s.userId)} disabled={s.currentStreak === 0}
                        className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white">
                        Resetear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Sección: Perfiles emocionales ────────────────────────────────────────────

const ProfilesSection = () => {
  const [profiles, setProfiles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [resettingId, setResetting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminGetAllProfiles();
      setProfiles(data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleReset = async (userId) => {
    setResetting(userId);
    setConfirmId(null);
    try {
      const { data } = await adminResetUserProfile(userId);
      toast.success('Perfil reseteado. El usuario podrá completar el cuestionario nuevamente.');
      setProfiles((prev) =>
        prev.map((p) =>
          p.userId === userId
            ? { ...p, emotionalProfile: 'SIN_PERFIL', completedAt: null }
            : p
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al resetear el perfil');
    } finally {
      setResetting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <ClipboardList size={15} className="text-purple-400" />
          <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase m-0">Perfiles emocionales</h3>
          <span className="text-xs bg-purple-50 text-purple-500 font-bold px-2 py-0.5 rounded-full">{profiles.length}</span>
        </div>
        <button onClick={fetchProfiles} disabled={loading}
          className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer border-none bg-transparent">
          <RotateCcw size={12} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {loading && <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-purple-400" /></div>}
      {!loading && error && <div className="flex items-center gap-2 p-5 text-red-500"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
      {!loading && !error && profiles.length === 0 && <p className="text-sm text-gray-400 p-5">No hay perfiles generados aún.</p>}

      {!loading && !error && profiles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Usuario', 'Perfil emocional', 'Completado el', 'Acción'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {profiles.map((p) => (
                <tr key={p.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    @{p.username ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.emotionalProfile === 'SIN_PERFIL'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {PROFILE_LABEL[p.emotionalProfile] ?? p.emotionalProfile ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(p.completedAt)}</td>
                  <td className="px-4 py-3">
                    {confirmId === p.userId ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">¿Resetear perfil?</span>
                        <button onClick={() => handleReset(p.userId)} disabled={resettingId === p.userId}
                          className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 font-semibold cursor-pointer border-none">
                          {resettingId === p.userId ? '...' : 'Sí'}
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 font-semibold cursor-pointer border-none">
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(p.userId)}
                        disabled={p.emotionalProfile === 'SIN_PERFIL'}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 border border-orange-200 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-semibold cursor-pointer bg-white disabled:opacity-30 disabled:cursor-not-allowed">
                        <RotateCcw size={12} /> Resetear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Página principal con tabs ────────────────────────────────────────────────

const TABS = [
  { id: 'stats',    label: 'Estadísticas', icon: TrendingUp },
  { id: 'entries',  label: 'Registros',    icon: BarChart2 },
  { id: 'streaks',  label: 'Rachas',       icon: Flame },
  { id: 'profiles', label: 'Perfiles',     icon: Users },
];

export const MoodTrackingPage = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <BarChart2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 m-0">Mood Tracking</h2>
          <p className="text-sm text-gray-500 m-0">Seguimiento del estado de ánimo de los usuarios</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${
              activeTab === id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'bg-transparent text-gray-500 hover:text-indigo-500'
            }`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {activeTab === 'stats'    && <StatsCards />}
      {activeTab === 'entries'  && <MoodEntriesSection />}
      {activeTab === 'streaks'  && <StreaksSection />}
      {activeTab === 'profiles' && <ProfilesSection />}
    </div>
  );
};