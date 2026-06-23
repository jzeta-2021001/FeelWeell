import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import {
  getTodayMood,
  registerMood,
  getMoodHistory,
  getQuestionnaire,
  submitQuestionnaire,
  getUserEmotionalProfile,
} from '../../../shared/apis/mood';
import { Smile, History, ClipboardList, User, CheckCircle2, AlertCircle, Loader2, Flame } from 'lucide-react';
import toast from 'react-hot-toast';


const EMOTIONS_COMMON = [
  'FELIZ', 'TRISTE', 'ANSIOSO', 'CALMADO', 'ENOJADO',
  'EMOCIONADO', 'FRUSTRADO', 'NEUTRAL', 'ABRUMADO', 'ESPERANZADO',
  'MELANCOLICO', 'SATISFECHO', 'DESMOTIVADO', 'PREOCUPADO', 'AGOTADO',
];

const EMOTION_EMOJI = {
  FELIZ: '😊', TRISTE: '😢', ANSIOSO: '😰', CALMADO: '😌', ENOJADO: '😠',
  EMOCIONADO: '🤩', FRUSTRADO: '😤', NEUTRAL: '😐', ABRUMADO: '😵', ESPERANZADO: '🌟',
  MELANCOLICO: '😔', SATISFECHO: '😁', DESMOTIVADO: '😞', PREOCUPADO: '😟', AGOTADO: '😴',
};

const PROFILE_CONFIG = {
  ALEGRE:                   { label: 'Alegre',               color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  emoji: '😊' },
  NEUTRAL:                  { label: 'Neutral',              color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   emoji: '😐' },
  PROBLEMA_DE_ANSIEDAD:     { label: 'Ansiedad',             color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '😰' },
  PROBLEMA_DE_TRISTEZA:     { label: 'Tristeza',             color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', emoji: '😢' },
  PROBLEMA_DE_IRA:          { label: 'Manejo de ira',        color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    emoji: '😠' },
  PROBLEMA_DE_CULPABILIDAD: { label: 'Culpabilidad',         color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '😓' },
  AMOROSO:                  { label: 'Amoroso',              color: 'text-pink-600',   bg: 'bg-pink-50',   border: 'border-pink-200',   emoji: '❤️' },
  PROBLEMA_DE_DISOSACION:   { label: 'Disociación',          color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', emoji: '🌀' },
  PROBLEMA_DE_AISLAMIENTO:  { label: 'Aislamiento',          color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200',   emoji: '🚪' },
  SIN_PERFIL:               { label: 'Sin perfil aún',       color: 'text-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-200',   emoji: '❓' },
};

const TABS = [
  { id: 'today',         label: 'Emoción de Hoy',    icon: Smile },
  { id: 'history',       label: 'Historial',          icon: History },
  { id: 'questionnaire', label: 'Cuestionario',       icon: ClipboardList },
  { id: 'profile',       label: 'Perfil Emocional',   icon: User },
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });



const TodayTab = () => {
  const [todayEntry, setTodayEntry]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [selectedEmotion, setSelected]  = useState(null);
  const [intensity, setIntensity]       = useState(5);
  const [note, setNote]                 = useState('');

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTodayMood();
      setTodayEntry(data.registered ? data.data : null);
    } catch {
      setTodayEntry(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  const handleSubmit = async () => {
    if (!selectedEmotion) return toast.error('Selecciona una emoción');
    setSubmitting(true);
    try {
      await registerMood({ emotion: selectedEmotion, intensity, note });
      toast.success('¡Emoción registrada! 🎉');
      fetchToday();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className='flex justify-center py-16'>
      <Loader2 size={28} className='animate-spin text-[#8b91ef]' />
    </div>
  );

  if (todayEntry) return (
    <div className='flex flex-col items-center gap-5 py-8'>
      <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'>
        <CheckCircle2 size={40} className='text-green-500' />
      </div>
      <div className='text-center'>
        <h3 className='text-xl font-black text-[#2f3348] m-0'>¡Ya registraste hoy!</h3>
        <p className='text-sm text-[#9b9fb8] font-semibold mt-1'>Tu registro del día está guardado</p>
      </div>
      <div className='w-full max-w-sm bg-white border border-[#e5e7f0] rounded-2xl p-6 flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest'>Emoción</span>
          <span className='text-2xl'>{EMOTION_EMOJI[todayEntry.emotion] ?? '💬'}</span>
        </div>
        <p className='text-lg font-black text-[#2f3348] m-0'>{todayEntry.emotion}</p>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-extrabold text-[#9b9fb8]'>Intensidad</span>
          <span className='text-sm font-black text-[#6d72d8]'>{todayEntry.intensity} / 10</span>
        </div>
        {todayEntry.note && (
          <div className='bg-[#f5f6ff] rounded-xl p-3'>
            <p className='text-xs text-[#505570] font-semibold m-0 italic'>"{todayEntry.note}"</p>
          </div>
        )}
        <p className='text-xs text-[#c5c7d8] font-semibold m-0 text-right'>{formatDate(todayEntry.date)}</p>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <p className='text-sm font-extrabold text-[#505570] mb-3'>¿Cómo te sientes hoy?</p>
        <div className='flex flex-wrap gap-2'>
          {EMOTIONS_COMMON.map((em) => (
            <button key={em} onClick={() => setSelected(em)}
              className={`px-3.5 py-2 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-all ${
                selectedEmotion === em
                  ? 'bg-[#8b91ef] border-[#8b91ef] text-white shadow-md'
                  : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef] hover:text-[#6d72d8]'
              }`}>
              {EMOTION_EMOJI[em] ?? ''} {em}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className='text-sm font-extrabold text-[#505570] mb-3'>
          Intensidad: <span className='text-[#6d72d8]'>{intensity} / 10</span>
        </p>
        <div className='flex gap-2 flex-wrap'>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setIntensity(n)}
              className={`w-10 h-10 border-2 rounded-[10px] text-sm font-extrabold cursor-pointer transition-all ${
                intensity === n
                  ? 'bg-[#8b91ef] border-[#8b91ef] text-white shadow-md'
                  : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef]'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className='text-sm font-extrabold text-[#505570] mb-2'>Nota (opcional)</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder='¿Qué pasó hoy? ¿Algo que quieras recordar?'
          className='w-full border-[1.5px] border-[#e5e7f0] rounded-[14px] px-4 py-3 text-sm text-[#2f3348] font-semibold outline-none focus:border-[#8b91ef] resize-none transition-colors'
        />
        <p className='text-xs text-[#c5c7d8] text-right font-semibold mt-1'>{note.length}/500</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !selectedEmotion}
        className='w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black cursor-pointer disabled:opacity-50 hover:bg-[#a0a5f0] transition-colors flex items-center justify-center gap-2'
      >
        {submitting ? <Loader2 size={18} className='animate-spin' /> : <Smile size={18} />}
        {submitting ? 'Guardando...' : 'Registrar emoción de hoy'}
      </button>
    </div>
  );
};

// ── Sub-vista: Historial 
const HistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom]       = useState('');
  const [to, setTo]           = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to)   params.to   = to;
      const { data } = await getMoodHistory(params);
      setHistory(data.data ?? []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex gap-3 flex-wrap'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-extrabold text-[#505570]'>Desde</label>
          <input type='date' value={from} onChange={(e) => setFrom(e.target.value)}
            className='h-10 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3 text-sm font-semibold text-[#2f3348] outline-none focus:border-[#8b91ef] cursor-pointer' />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-extrabold text-[#505570]'>Hasta</label>
          <input type='date' value={to} onChange={(e) => setTo(e.target.value)}
            className='h-10 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3 text-sm font-semibold text-[#2f3348] outline-none focus:border-[#8b91ef] cursor-pointer' />
        </div>
        {(from || to) && (
          <button onClick={() => { setFrom(''); setTo(''); }}
            className='self-end h-10 px-4 border-[1.5px] border-[#e5e7f0] rounded-[10px] text-xs font-extrabold text-[#9b9fb8] hover:text-[#d14b6d] hover:border-[#d14b6d] transition-colors cursor-pointer bg-white'>
            Limpiar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className='flex justify-center py-12'>
          <Loader2 size={28} className='animate-spin text-[#8b91ef]' />
        </div>
      ) : history.length === 0 ? (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
          <History size={36} className='text-[#d0d2e8]' />
          <p className='text-sm font-bold text-[#9b9fb8] m-0'>No hay registros en este período</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {history.map((entry) => (
            <div key={entry._id} className='bg-white border border-[#e5e7f0] rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow'>
              <div className='text-2xl shrink-0 mt-0.5'>{EMOTION_EMOJI[entry.emotion] ?? '💬'}</div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2 flex-wrap'>
                  <p className='m-0 text-sm font-black text-[#2f3348]'>{entry.emotion}</p>
                  <span className='text-xs font-bold text-[#9b9fb8]'>{formatDate(entry.date)}</span>
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <div className='flex gap-1'>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < entry.intensity ? 'bg-[#8b91ef]' : 'bg-[#e5e7f0]'}`} />
                    ))}
                  </div>
                  <span className='text-xs font-bold text-[#6d72d8]'>{entry.intensity}/10</span>
                </div>
                {entry.note && (
                  <p className='m-0 mt-2 text-xs text-[#7b8094] font-semibold italic line-clamp-2'>"{entry.note}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sub-vista: Cuestionario 
const QuestionnaireTab = ({ onProfileUpdated }) => {
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [result, setResult]         = useState(null);

  useEffect(() => {
    getQuestionnaire()
      .then(({ data }) => setQuestions(data.data ?? []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.questionId] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered) return toast.error('Responde todas las preguntas');
    setSubmitting(true);
    try {
      const answersArr = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      }));
      const { data } = await submitQuestionnaire(answersArr);
      setResult(data.data);
      setDone(true);
      onProfileUpdated?.();
      toast.success('¡Cuestionario completado!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar cuestionario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className='flex justify-center py-16'>
      <Loader2 size={28} className='animate-spin text-[#8b91ef]' />
    </div>
  );

  if (done && result) {
    const cfg = PROFILE_CONFIG[result.emotionalProfile] ?? PROFILE_CONFIG.SIN_PERFIL;
    return (
      <div className='flex flex-col items-center gap-5 py-8 text-center'>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 ${cfg.bg} ${cfg.border}`}>
          {cfg.emoji}
        </div>
        <div>
          <h3 className='text-xl font-black text-[#2f3348] m-0'>Tu perfil emocional</h3>
          <p className={`text-lg font-extrabold mt-1 ${cfg.color}`}>{cfg.label}</p>
          <p className='text-sm text-[#9b9fb8] font-semibold mt-2 max-w-xs mx-auto'>
            Basado en tus respuestas hemos generado tu perfil emocional. Puedes verlo en la pestaña Perfil Emocional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='bg-[#f5f6ff] rounded-2xl p-4'>
        <p className='text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest m-0 mb-1'>Evaluación inicial</p>
        <p className='text-sm text-[#505570] font-semibold m-0'>
          Responde honestamente. Esto nos ayuda a personalizar tu experiencia en FeelWeell.
        </p>
      </div>

      {questions.map((q, idx) => (
        <div key={q.questionId} className='flex flex-col gap-3'>
          <p className='text-sm font-extrabold text-[#2f3348] m-0'>
            {idx + 1}. {q.text}
          </p>
          <div className='flex gap-2 flex-wrap'>
            {q.options.map((opt) => (
              <button key={opt.value} onClick={() => handleAnswer(q.questionId, opt.value)}
                className={`px-4 py-2.5 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-all ${
                  answers[q.questionId] === opt.value
                    ? 'bg-[#8b91ef] border-[#8b91ef] text-white shadow-md'
                    : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef] hover:text-[#6d72d8]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting || !allAnswered}
        className='w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black cursor-pointer disabled:opacity-50 hover:bg-[#a0a5f0] transition-colors flex items-center justify-center gap-2'
      >
        {submitting ? <Loader2 size={18} className='animate-spin' /> : <ClipboardList size={18} />}
        {submitting ? 'Enviando...' : 'Enviar respuestas'}
      </button>
    </div>
  );
};

// ── Sub-vista: Perfil Emocional 

const ProfileTab = ({ refresh }) => {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserEmotionalProfile()
      .then(({ data }) => setProfile(data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return (
    <div className='flex justify-center py-16'>
      <Loader2 size={28} className='animate-spin text-[#8b91ef]' />
    </div>
  );

  if (!profile || !profile.completedQuestionnaire) return (
    <div className='flex flex-col items-center gap-4 py-12 text-center'>
      <div className='w-16 h-16 rounded-full bg-[#f0f1ff] flex items-center justify-center'>
        <AlertCircle size={28} className='text-[#8b91ef]' />
      </div>
      <div>
        <h3 className='text-base font-black text-[#2f3348] m-0'>Aún no tienes perfil</h3>
        <p className='text-sm text-[#9b9fb8] font-semibold mt-1 max-w-xs mx-auto'>
          Completa el cuestionario inicial para generar tu perfil emocional personalizado.
        </p>
      </div>
    </div>
  );

  const cfg = PROFILE_CONFIG[profile.emotionalProfile] ?? PROFILE_CONFIG.SIN_PERFIL;

  return (
    <div className='flex flex-col gap-5'>
      <div className={`rounded-2xl p-6 border-2 ${cfg.bg} ${cfg.border} flex flex-col items-center gap-3 text-center`}>
        <div className='text-5xl'>{cfg.emoji}</div>
        <div>
          <p className='text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest m-0 mb-1'>Tu perfil emocional</p>
          <h3 className={`text-2xl font-black m-0 ${cfg.color}`}>{cfg.label}</h3>
        </div>
        {profile.completedAt && (
          <p className='text-xs text-[#9b9fb8] font-semibold m-0'>
            Evaluado el {formatDate(profile.completedAt)}
          </p>
        )}
      </div>

      <div className='bg-white border border-[#e5e7f0] rounded-2xl p-5 flex flex-col gap-3'>
        <p className='text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest m-0'>¿Qué significa esto?</p>
        <p className='text-sm text-[#505570] font-semibold m-0 leading-relaxed'>
          {profile.emotionalProfile === 'ALEGRE' &&
            'Tienes un estado emocional positivo y balanceado. ¡Sigue así! Mantén tus hábitos de bienestar.'}
          {profile.emotionalProfile === 'NEUTRAL' &&
            'Tu estado emocional es estable. Hay espacio para fortalecer tu bienestar con pequeños hábitos diarios.'}
          {profile.emotionalProfile === 'PROBLEMA_DE_ANSIEDAD' &&
            'Podrías estar experimentando niveles elevados de ansiedad. Los ejercicios de respiración y mindfulness pueden ayudarte.'}
          {profile.emotionalProfile === 'PROBLEMA_DE_TRISTEZA' &&
            'Parece que estás pasando por un período difícil. No estás solo/a — considera hablar con alguien de confianza o un profesional.'}
          {profile.emotionalProfile === 'PROBLEMA_DE_IRA' &&
            'Podrías estar experimentando dificultades para manejar la ira. Los ejercicios de relajación pueden ser de gran ayuda.'}
          {profile.emotionalProfile === 'PROBLEMA_DE_CULPABILIDAD' &&
            'Parece que llevas carga emocional relacionada con la culpa. Hablar con un profesional puede ayudarte a procesarla.'}
          {profile.emotionalProfile === 'AMOROSO' &&
            'Tu estado emocional está orientado hacia el amor y la conexión. Comparte ese bienestar con quienes te rodean.'}
          {(profile.emotionalProfile === 'PROBLEMA_DE_DISOSACION' || profile.emotionalProfile === 'PROBLEMA_DE_AISLAMIENTO') &&
            'Es posible que estés experimentando desconexión emocional. Buscar apoyo profesional puede marcar una gran diferencia.'}
          {profile.emotionalProfile === 'SIN_PERFIL' &&
            'Completa el cuestionario para ver tu perfil emocional.'}
        </p>
      </div>

      <div className='bg-[#fff8e7] border border-[#fde68a] rounded-2xl p-4'>
        <p className='text-xs font-extrabold text-[#b45309] uppercase tracking-widest m-0 mb-1'>Recuerda</p>
        <p className='text-xs text-[#78350f] font-semibold m-0 leading-relaxed'>
          Este perfil es orientativo y no reemplaza la opinión de un profesional de salud mental.
          Si sientes que lo necesitas, busca ayuda especializada.
        </p>
      </div>
    </div>
  );
};

// ── Página principal

export const MoodPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab]           = useState('today');
  const [profileRefresh, setProfileRefresh] = useState(0);

  const handleProfileUpdated = () => {
    setProfileRefresh((n) => n + 1);
    setActiveTab('profile');
  };

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='rounded-2xl p-6' style={{ background: 'linear-gradient(135deg,#c5c8f2 0%,#d8d4ff 50%,#b9c9f5 100%)' }}>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center'>
            <Smile size={20} className='text-[#3d3a8c]' />
          </div>
          <div>
            <h1 className='m-0 text-xl font-black text-[#2f3348]'>Mi Bienestar Emocional</h1>
            <p className='m-0 text-xs font-semibold text-[#4a4f6b]'>
              Hola, {user?.firstName} — registra cómo te sientes hoy
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-white border border-[#e5e7f0] rounded-xl p-1.5'>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-extrabold border-none cursor-pointer transition-all ${
              activeTab === id
                ? 'bg-[#8b91ef] text-white shadow-sm'
                : 'bg-transparent text-[#7b8094] hover:bg-[#f0f1ff] hover:text-[#6d72d8]'
            }`}>
            <Icon size={14} />
            <span className='hidden sm:inline'>{label}</span>
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className='bg-white border border-[#e5e7f0] rounded-2xl p-5'>
        {activeTab === 'today'         && <TodayTab />}
        {activeTab === 'history'       && <HistoryTab />}
        {activeTab === 'questionnaire' && <QuestionnaireTab onProfileUpdated={handleProfileUpdated} />}
        {activeTab === 'profile'       && <ProfileTab refresh={profileRefresh} />}
      </div>
    </div>
  );
};