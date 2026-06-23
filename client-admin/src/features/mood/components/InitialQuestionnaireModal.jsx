import { useState, useEffect } from 'react';
import { ClipboardList, Loader2, CheckCircle2, X } from 'lucide-react';
import { getQuestionnaire, submitQuestionnaire, getUserEmotionalProfile } from '../../../shared/apis/mood';
import toast from 'react-hot-toast';

const PROFILE_CONFIG = {
  ALEGRE:                   { label: 'Alegre',       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  emoji: '😊' },
  NEUTRAL:                  { label: 'Neutral',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   emoji: '😐' },
  PROBLEMA_DE_ANSIEDAD:     { label: 'Ansiedad',     color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '😰' },
  PROBLEMA_DE_TRISTEZA:     { label: 'Tristeza',     color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', emoji: '😢' },
  PROBLEMA_DE_IRA:          { label: 'Ira',          color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    emoji: '😠' },
  PROBLEMA_DE_CULPABILIDAD: { label: 'Culpabilidad', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '😓' },
  AMOROSO:                  { label: 'Amoroso',      color: 'text-pink-600',   bg: 'bg-pink-50',   border: 'border-pink-200',   emoji: '❤️' },
  PROBLEMA_DE_DISOSACION:   { label: 'Disociación',  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', emoji: '🌀' },
  PROBLEMA_DE_AISLAMIENTO:  { label: 'Aislamiento',  color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200',   emoji: '🚪' },
  SIN_PERFIL:               { label: 'Sin perfil',   color: 'text-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-200',   emoji: '❓' },
};

export const InitialQuestionnaireModal = ({ onComplete }) => {
  const [step, setStep]             = useState('loading'); // loading | questionnaire | result
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null);

  useEffect(() => {
    // Verificar si el usuario ya completó el cuestionario
    getUserEmotionalProfile()
      .then(({ data }) => {
        if (data.data?.completedQuestionnaire) {
          // Ya lo completó, cerrar modal directamente
          onComplete();
        } else {
          // No lo ha completado, cargar preguntas
          return getQuestionnaire().then(({ data: qData }) => {
            setQuestions(qData.data ?? []);
            setStep('questionnaire');
          });
        }
      })
      .catch(() => {
        // Si falla la verificación, igual mostramos el cuestionario
        getQuestionnaire()
          .then(({ data: qData }) => {
            setQuestions(qData.data ?? []);
            setStep('questionnaire');
          })
          .catch(() => onComplete()); 
      });
  }, [onComplete]);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.questionId] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered) return toast.error('Responde todas las preguntas para continuar');
    setSubmitting(true);
    try {
      const answersArr = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      }));
      const { data } = await submitQuestionnaire(answersArr);
      setResult(data.data);
      setStep('result');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar el cuestionario');
    } finally {
      setSubmitting(false);
    }
  };

  // Overlay con blur — bloquea la app hasta completar
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center' style={{ background: 'rgba(30,32,60,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col' style={{ maxHeight: '90vh' }}>

        {/* Header fijo */}
        <div className='px-6 pt-6 pb-4 flex items-center gap-3 border-b border-[#f0f1ff] shrink-0'>
          <div className='w-10 h-10 rounded-xl bg-[#f0f1ff] flex items-center justify-center shrink-0'>
            <ClipboardList size={20} className='text-[#8b91ef]' />
          </div>
          <div>
            <h2 className='m-0 text-base font-black text-[#2f3348]'>Evaluación inicial</h2>
            <p className='m-0 text-xs text-[#9b9fb8] font-semibold'>Solo toma un momento — personaliza tu experiencia</p>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className='overflow-y-auto flex-1 px-6 py-5'>

          {/* LOADING */}
          {step === 'loading' && (
            <div className='flex justify-center py-12'>
              <Loader2 size={32} className='animate-spin text-[#8b91ef]' />
            </div>
          )}

          {/* CUESTIONARIO */}
          {step === 'questionnaire' && (
            <div className='flex flex-col gap-6'>
              <div className='bg-[#f5f6ff] rounded-2xl p-4'>
                <p className='text-sm text-[#505570] font-semibold m-0 leading-relaxed'>
                  Antes de comenzar, responde estas preguntas. Tus respuestas nos ayudan a darte
                  una experiencia personalizada en FeelWeell 💙
                </p>
              </div>

              {questions.map((q, idx) => (
                <div key={q.questionId} className='flex flex-col gap-3'>
                  <p className='text-sm font-extrabold text-[#2f3348] m-0'>
                    {idx + 1}. {q.text}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.questionId, opt.value)}
                        className={`px-4 py-2.5 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-all ${
                          answers[q.questionId] === opt.value
                            ? 'bg-[#8b91ef] border-[#8b91ef] text-white shadow-md'
                            : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef] hover:text-[#6d72d8]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RESULTADO */}
          {step === 'result' && result && (() => {
            const cfg = PROFILE_CONFIG[result.emotionalProfile] ?? PROFILE_CONFIG.SIN_PERFIL;
            return (
              <div className='flex flex-col items-center gap-5 py-4 text-center'>
                <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'>
                  <CheckCircle2 size={40} className='text-green-500' />
                </div>
                <div>
                  <h3 className='text-xl font-black text-[#2f3348] m-0'>¡Listo!</h3>
                  <p className='text-sm text-[#9b9fb8] font-semibold mt-1'>Hemos generado tu perfil emocional</p>
                </div>
                <div className={`w-full rounded-2xl p-5 border-2 ${cfg.bg} ${cfg.border} flex flex-col items-center gap-2`}>
                  <span className='text-4xl'>{cfg.emoji}</span>
                  <p className='text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest m-0'>Tu perfil</p>
                  <p className={`text-xl font-black m-0 ${cfg.color}`}>{cfg.label}</p>
                </div>
                <p className='text-xs text-[#9b9fb8] font-semibold leading-relaxed'>
                  Puedes ver más detalles en la sección <strong>Mi Bienestar Emocional</strong> → Perfil Emocional.
                </p>
              </div>
            );
          })()}
        </div>

        {/* Footer fijo */}
        <div className='px-6 pb-6 pt-4 border-t border-[#f0f1ff] shrink-0'>
          {step === 'questionnaire' && (
            <button
              onClick={handleSubmit}
              disabled={submitting || !allAnswered}
              className='w-full h-12 border-none rounded-full bg-[#8b91ef] text-white text-sm font-black cursor-pointer disabled:opacity-40 hover:bg-[#6d72d8] transition-colors flex items-center justify-center gap-2'
            >
              {submitting ? <Loader2 size={16} className='animate-spin' /> : <ClipboardList size={16} />}
              {submitting ? 'Enviando...' : 'Enviar respuestas'}
            </button>
          )}
          {step === 'result' && (
            <button
              onClick={onComplete}
              className='w-full h-12 border-none rounded-full bg-[#8b91ef] text-white text-sm font-black cursor-pointer hover:bg-[#6d72d8] transition-colors'
            >
              Comenzar en FeelWeell
            </button>
          )}
        </div>
      </div>
    </div>
  );
};