import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { progressService } from '../../services/progressService';
import { analyticsService } from '../../services/analyticsService';
import ProgressBar from '../../components/ProgressBar';
import { BookOpen, TrendingUp, Award, Clock, ChevronRight, Loader2, BookMarked } from 'lucide-react';

interface CourseItem { _id: string; title: string; description: string; thumbnail: string; category: string; difficulty: string; totalSections: number; totalModules: number; }
interface ProgressItem { courseId: { _id: string; title: string; thumbnail: string; category: string }; percentage: number; completedCount: number; totalSections: number; lastAccessed: string; completedAt: string | null; }
interface Analytics { coursesEnrolled: number; coursesCompleted: number; totalSectionsCompleted: number; averageProgress: number; recentActivity: Array<{ type: string; metadata: { courseName?: string; sectionName?: string; score?: number }; createdAt: string }>; }

export default function LearningDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Dashboard - BSC Exclusive'; }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesRes, progressRes, analyticsRes] = await Promise.all([
          courseService.getCourses(),
          progressService.getAllProgress(),
          analyticsService.getUserAnalytics(),
        ]);
        setCourses(coursesRes.courses || []);
        setProgress(progressRes.progress || []);
        setAnalytics(analyticsRes.analytics || null);
      } catch (err) { console.error('Dashboard load error:', err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#B91C1C' }} />
          <p style={{ color: '#8A7A6A', marginTop: '12px' }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const inProgressCourses = progress.filter(p => p.percentage > 0 && p.percentage < 100);
  const completedCourses = progress.filter(p => p.percentage >= 100);

  const activityLabels: Record<string, string> = {
    course_opened: '📖 Opened course',
    section_completed: '✅ Completed section',
    section_opened: '📄 Viewed section',
    quiz_attempted: '📝 Attempted quiz',
    quiz_passed: '🎉 Passed quiz',
    course_completed: '🏆 Completed course',
    login: '🔑 Logged in',
    profile_updated: '👤 Updated profile',
  };

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1E3A8A', border: '1px solid rgba(30,58,138,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Learning Dashboard</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '4px' }}>Welcome back, <span style={{ fontWeight: 700, color: '#A05252' }}>{user?.name || 'Learner'}</span></h1>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Continue your learning journey where you left off</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {[
          { icon: <BookOpen size={22} />, label: 'Enrolled', value: analytics?.coursesEnrolled || 0, color: '#3b82f6' },
          { icon: <TrendingUp size={22} />, label: 'Avg Progress', value: `${analytics?.averageProgress || 0}%`, color: '#B91C1C' },
          { icon: <Award size={22} />, label: 'Completed', value: analytics?.coursesCompleted || 0, color: '#16a34a' },
          { icon: <Clock size={22} />, label: 'Sections Done', value: analytics?.totalSectionsCompleted || 0, color: '#1E3A8A' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookMarked size={20} color="#B91C1C" /> Continue Learning
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {inProgressCourses.map((p) => (
              <Link key={p.courseId._id} to={`/learning/${p.courseId._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#fff', border: '1px solid #F0EBE5', padding: '20px', textDecoration: 'none', color: 'inherit', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <img src={p.courseId.thumbnail} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '6px' }}>{p.courseId.title}</h3>
                  <ProgressBar percentage={p.percentage} height={6} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 600, fontSize: '0.8rem', flexShrink: 0 }}>
                  Continue <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1A1A2E' }}>All Courses</h2>
          <Link to="/learning" style={{ color: '#B91C1C', fontSize: '0.8rem', fontWeight: 600 }}>View All →</Link>
        </div>
        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #F0EBE5' }}>
            <BookOpen size={40} style={{ color: '#ddd', margin: '0 auto 12px' }} />
            <p style={{ color: '#999' }}>No courses available yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {courses.slice(0, 6).map((c) => {
              const cp = progress.find(p => p.courseId?._id === c._id);
              return (
                <Link key={c._id} to={`/learning/${c._id}`}
                  style={{ background: '#fff', border: '1px solid #F0EBE5', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                    <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '3px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.difficulty}</span>
                    {cp && cp.percentage >= 100 && <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#16a34a', color: '#fff', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '3px', fontWeight: 600 }}>✓ Complete</span>}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B8A88A', fontWeight: 500 }}>{c.category}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '6px 0 8px', color: '#1A1A1A' }}>{c.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#8A7A6A', lineHeight: 1.5, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#999' }}>
                      <span>{c.totalModules} modules · {c.totalSections} sections</span>
                    </div>
                    {cp && <div style={{ marginTop: '12px' }}><ProgressBar percentage={cp.percentage} height={4} /></div>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity & Completed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#1A1A2E' }}>Recent Activity</h3>
          {(!analytics?.recentActivity || analytics.recentActivity.length === 0) ? (
            <p style={{ color: '#999', fontSize: '0.85rem' }}>No recent activity yet. Start learning!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.recentActivity.slice(0, 6).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                  <span>{activityLabels[a.type] || a.type}</span>
                  <span style={{ color: '#999', fontSize: '0.75rem', flexShrink: 0, marginLeft: 'auto' }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Courses */}
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#1A1A2E' }}>Completed Courses</h3>
          {completedCourses.length === 0 ? (
            <p style={{ color: '#999', fontSize: '0.85rem' }}>No courses completed yet. Keep learning!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedCourses.map((p) => (
                <div key={p.courseId._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '6px' }}>
                  <Award size={20} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#166534' }}>{p.courseId.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>Completed {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
