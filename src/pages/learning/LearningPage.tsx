import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningService } from '../../services/learningService';
import { progressService } from '../../services/progressService';
import { quizService } from '../../services/quizService';
import ProgressBar from '../../components/ProgressBar';
import ScrollToTop from '../../components/ScrollToTop';
import { showToast } from '../../components/Toast';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Loader2, BookOpen, Clock, Menu, X, Award } from 'lucide-react';

interface Section { _id: string; title: string; content: string; contentType: string; order: number; estimatedTime: number; }
interface ModuleData { _id: string; title: string; order: number; sections: Section[]; }
interface CourseData { _id: string; title: string; description: string; category: string; instructor: string; totalSections: number; modules: ModuleData[]; }
interface QuizQuestion { _id: string; question: string; options: string[]; }
interface QuizData { _id: string; title: string; questions: QuizQuestion[]; passingScore: number; totalQuestions: number; }
interface QuizResult { question: string; options: string[]; correctAnswer: number; selectedAnswer: number; isCorrect: boolean; explanation: string; }

export default function LearningPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  // Quiz state
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<{ score: number; passed: boolean; results: QuizResult[] } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const allSections = course?.modules?.flatMap(m => m.sections) || [];

  const loadData = useCallback(async () => {
    if (!courseId) return;
    try {
      const [courseRes, progressRes] = await Promise.all([
        learningService.getLearningContent(courseId),
        progressService.getProgress(courseId),
      ]);
      setCourse(courseRes.course);
      const completed = progressRes.progress?.completedSections || [];
      setCompletedSections(completed.map((s: string | { _id: string }) => typeof s === 'string' ? s : s._id));
      setPercentage(progressRes.progress?.percentage || 0);

      // Set active section
      const sections = courseRes.course?.modules?.flatMap((m: ModuleData) => m.sections) || [];
      if (sections.length > 0) {
        const currentId = progressRes.progress?.currentSection;
        const current = currentId ? sections.find((s: Section) => s._id === currentId) : null;
        setActiveSection(current || sections[0]);
      }
    } catch (err) { console.error('Learning page load error:', err); }
    finally { setLoading(false); }
  }, [courseId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (course) document.title = `${course.title} - Learning`;
  }, [course]);

  // Scroll-based reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Save current section position
  useEffect(() => {
    if (courseId && activeSection) {
      progressService.updateProgress(courseId, { currentSection: activeSection._id }).catch(() => {});
    }
  }, [courseId, activeSection]);

  const handleCompleteSection = async () => {
    if (!activeSection || completing) return;
    setCompleting(true);
    try {
      const res = await progressService.completeSection(activeSection._id);
      if (res.success) {
        setCompletedSections(res.progress.completedSections);
        setPercentage(res.progress.percentage);
        showToast('success', res.message);
      }
    } catch { showToast('error', 'Failed to save progress'); }
    finally { setCompleting(false); }
  };

  const navigateSection = (direction: 'prev' | 'next') => {
    const idx = allSections.findIndex(s => s._id === activeSection?._id);
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < allSections.length) {
      setActiveSection(allSections[newIdx]);
      setQuiz(null);
      setQuizResults(null);
      setQuizAnswers([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loadQuiz = async (sectionId: string) => {
    try {
      const res = await quizService.getQuiz(sectionId);
      if (res.success) {
        setQuiz(res.quiz);
        setQuizAnswers(new Array(res.quiz.questions.length).fill(-1));
        setQuizResults(null);
      }
    } catch { showToast('info', 'No quiz available for this section'); }
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    setSubmittingQuiz(true);
    try {
      const res = await quizService.submitQuiz(quiz._id, { answers: quizAnswers });
      if (res.success) {
        setQuizResults({ score: res.result.score, passed: res.result.passed, results: res.results });
        showToast(res.result.passed ? 'success' : 'info', res.message);
      }
    } catch { showToast('error', 'Failed to submit quiz'); }
    finally { setSubmittingQuiz(false); }
  };

  const currentIdx = allSections.findIndex(s => s._id === activeSection?._id);
  const isSectionCompleted = activeSection ? completedSections.includes(activeSection._id) : false;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FDF8F3' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#C47A6A' }} />
          <p style={{ color: '#8A7A6A', marginTop: '16px' }}>Loading course content...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FDF8F3' }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: '#ddd', marginBottom: '16px' }} />
          <h2 style={{ color: '#2C2826', marginBottom: '8px' }}>Course Not Found</h2>
          <Link to="/dashboard" style={{ color: '#C47A6A', fontWeight: 600 }}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Render markdown-like content (simple version)
  const renderContent = (content: string) => {
    if (!content) return <p style={{ color: '#999' }}>No content available for this section.</p>;
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1A1A1A', marginTop: '32px', marginBottom: '16px', lineHeight: 1.3 }}>{trimmed.slice(2)}</h1>;
      if (trimmed.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 600, color: '#2C2826', marginTop: '28px', marginBottom: '12px', lineHeight: 1.3 }}>{trimmed.slice(3)}</h2>;
      if (trimmed.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2C2826', marginTop: '24px', marginBottom: '10px' }}>{trimmed.slice(4)}</h3>;
      if (trimmed.startsWith('> ')) return <blockquote key={i} style={{ borderLeft: '4px solid #D4A574', padding: '12px 20px', margin: '16px 0', background: '#FDF8F3', color: '#5A4A3A', fontStyle: 'italic', lineHeight: 1.7 }}>{trimmed.slice(2)}</blockquote>;
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', lineHeight: 1.7, color: '#4A4A4A' }}>{formatInline(trimmed.slice(2))}</li>;
      if (/^\d+\.\s/.test(trimmed)) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', lineHeight: 1.7, color: '#4A4A4A', listStyleType: 'decimal' }}>{formatInline(trimmed.replace(/^\d+\.\s/, ''))}</li>;
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed.split('|').filter(c => c.trim()).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return null; // separator row
        const isHeader = i > 0 && lines[i + 1]?.trim().startsWith('|') && /^[\s|:-]+$/.test(lines[i + 1].trim());
        return (
          <tr key={i} style={{ borderBottom: '1px solid #E8E0D6' }}>
            {cells.map((cell, ci) => isHeader
              ? <th key={ci} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#2C2826', background: '#F5F0EB' }}>{cell}</th>
              : <td key={ci} style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#4A4A4A' }}>{formatInline(cell)}</td>
            )}
          </tr>
        );
      }
      if (trimmed.startsWith('⚠️') || trimmed.startsWith('✅') || trimmed.startsWith('❌') || trimmed.startsWith('🔹')) {
        return <p key={i} style={{ margin: '8px 0', lineHeight: 1.7, color: '#4A4A4A', paddingLeft: '4px' }}>{formatInline(trimmed)}</p>;
      }
      if (trimmed === '') return <div key={i} style={{ height: '8px' }} />;
      return <p key={i} style={{ margin: '8px 0', lineHeight: 1.8, color: '#4A4A4A', fontSize: '0.95rem' }}>{formatInline(trimmed)}</p>;
    });
  };

  function formatInline(text: string) {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 600, color: '#1A1A1A' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  // Check if content contains a table and wrap it
  const hasTable = activeSection?.content?.includes('|');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FDF8F3' }}>
      {/* Reading progress bar at top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 100, background: '#E8E0D6' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #C47A6A, #D4A574)', width: `${readProgress}%`, transition: 'width 0.1s' }} />
      </div>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '320px' : '0', minHeight: '100vh', background: '#fff', borderRight: '1px solid #E8E0D6',
        overflow: 'hidden', transition: 'width 0.3s ease', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E8E0D6' }}>
          <Link to="/dashboard" style={{ color: '#8A7A6A', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <ChevronLeft size={14} /> Back to Dashboard
          </Link>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h2>
          <ProgressBar percentage={percentage} height={6} />
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
          {course.modules.map((mod) => (
            <div key={mod._id} style={{ marginBottom: '8px' }}>
              <div style={{ padding: '10px 20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B8A88A' }}>
                {mod.title}
              </div>
              {mod.sections.map((sec) => {
                const isActive = activeSection?._id === sec._id;
                const isCompleted = completedSections.includes(sec._id);
                return (
                  <button key={sec._id} onClick={() => { setActiveSection(sec); setQuiz(null); setQuizResults(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 20px',
                      background: isActive ? '#FDF8F3' : 'transparent', border: 'none', borderLeft: isActive ? '3px solid #C47A6A' : '3px solid transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                    {isCompleted ? <CheckCircle size={16} color="#16a34a" /> : <Circle size={16} color={isActive ? '#C47A6A' : '#ddd'} />}
                    <span style={{ fontSize: '0.82rem', color: isActive ? '#C47A6A' : isCompleted ? '#16a34a' : '#4A4A4A', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>{sec.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #E8E0D6', background: '#FAFAF7' }}>
          <div style={{ fontSize: '0.75rem', color: '#8A7A6A', fontWeight: 600, marginBottom: '4px' }}>Course Progress</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: percentage >= 100 ? '#16a34a' : '#C47A6A' }}>{percentage}%</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: '3px', zIndex: 50, background: '#fff', borderBottom: '1px solid #E8E0D6', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7A6A', padding: '4px' }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', color: '#B8A88A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{course.title}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeSection?.title || ''}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#8A7A6A', flexShrink: 0 }}>
            <Clock size={14} /> {activeSection?.estimatedTime || 0} min
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: percentage >= 100 ? '#16a34a' : '#C47A6A', flexShrink: 0 }}>{percentage}%</div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 32px 100px' }}>
          {activeSection?.contentType === 'quiz' ? (
            <div>
              {renderContent(activeSection.content)}
              {!quiz && !quizResults && (
                <button onClick={() => loadQuiz(activeSection._id)} style={{ marginTop: '24px', padding: '14px 28px', background: '#C47A6A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Start Quiz
                </button>
              )}
              {quiz && !quizResults && (
                <div style={{ marginTop: '32px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>{quiz.title}</h2>
                  {quiz.questions.map((q, qi) => (
                    <div key={q._id} style={{ marginBottom: '28px', padding: '20px', background: '#fff', border: '1px solid #E8E0D6', borderRadius: '6px' }}>
                      <p style={{ fontWeight: 600, marginBottom: '14px', color: '#1A1A1A' }}>{qi + 1}. {q.question}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, oi) => (
                          <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: `1.5px solid ${quizAnswers[qi] === oi ? '#C47A6A' : '#E8E0D6'}`, borderRadius: '4px', cursor: 'pointer', background: quizAnswers[qi] === oi ? '#FDF8F3' : '#fff', transition: 'all 0.2s' }}>
                            <input type="radio" name={`q-${qi}`} checked={quizAnswers[qi] === oi} onChange={() => { const newAnswers = [...quizAnswers]; newAnswers[qi] = oi; setQuizAnswers(newAnswers); }}
                              style={{ accentColor: '#C47A6A' }} />
                            <span style={{ fontSize: '0.9rem', color: '#4A4A4A' }}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitQuiz} disabled={submittingQuiz || quizAnswers.includes(-1)}
                    style={{ padding: '14px 32px', background: quizAnswers.includes(-1) ? '#B8A88A' : '#C47A6A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: quizAnswers.includes(-1) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {submittingQuiz ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Quiz'}
                  </button>
                </div>
              )}
              {quizResults && (
                <div style={{ marginTop: '32px' }}>
                  <div style={{ textAlign: 'center', padding: '32px', background: quizResults.passed ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', marginBottom: '28px' }}>
                    <Award size={48} color={quizResults.passed ? '#16a34a' : '#ef4444'} style={{ marginBottom: '12px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: quizResults.passed ? '#166534' : '#991b1b', marginBottom: '8px' }}>
                      {quizResults.passed ? 'Congratulations!' : 'Keep Learning!'}
                    </h2>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: quizResults.passed ? '#16a34a' : '#ef4444' }}>{quizResults.score}%</div>
                  </div>
                  {quizResults.results.map((r, i) => (
                    <div key={i} style={{ marginBottom: '16px', padding: '16px', background: r.isCorrect ? '#f0fdf4' : '#fef2f2', border: `1px solid ${r.isCorrect ? '#bbf7d0' : '#fecaca'}`, borderRadius: '6px' }}>
                      <p style={{ fontWeight: 600, marginBottom: '8px' }}>{i + 1}. {r.question}</p>
                      <p style={{ fontSize: '0.85rem', color: r.isCorrect ? '#166534' : '#991b1b' }}>
                        Your answer: {r.options[r.selectedAnswer]} {r.isCorrect ? '✓' : `✗ (Correct: ${r.options[r.correctAnswer]})`}
                      </p>
                      {r.explanation && <p style={{ fontSize: '0.82rem', color: '#6B6B6B', marginTop: '6px', fontStyle: 'italic' }}>{r.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {hasTable ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E8E0D6', margin: '16px 0' }}>
                  <tbody>{renderContent(activeSection?.content || '')}</tbody>
                </table>
              ) : (
                renderContent(activeSection?.content || '')
              )}
            </div>
          )}

          {/* Section completion & navigation */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #E8E0D6' }}>
            {!isSectionCompleted ? (
              <button onClick={handleCompleteSection} disabled={completing}
                style={{ width: '100%', padding: '16px', background: completing ? '#B8A88A' : '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: completing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                {completing ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><CheckCircle size={18} /> Mark Section as Complete</>}
              </button>
            ) : (
              <div style={{ width: '100%', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', textAlign: 'center', color: '#166534', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Section Completed
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button onClick={() => navigateSection('prev')} disabled={currentIdx <= 0}
                style={{ flex: 1, padding: '14px', background: currentIdx <= 0 ? '#f5f5f5' : '#fff', color: currentIdx <= 0 ? '#ccc' : '#2C2826', border: '1.5px solid #E8E0D6', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500, cursor: currentIdx <= 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={() => navigateSection('next')} disabled={currentIdx >= allSections.length - 1}
                style={{ flex: 1, padding: '14px', background: currentIdx >= allSections.length - 1 ? '#f5f5f5' : '#C47A6A', color: currentIdx >= allSections.length - 1 ? '#ccc' : '#fff', border: '1.5px solid transparent', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: currentIdx >= allSections.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTop />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
