import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Silk from '../components/Silk';
import { useLoaderAnimation } from '../hooks/useLoaderAnimation';
import { ROUTES } from '../constants/routes';
import '../styles/landing.css';
import Counter from '../components/Counter';

export default function Home() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();

  useLoaderAnimation();

  const handleBrowse = () => {
    if (user) {
      navigate(ROUTES.BROWSE_RESOURCES);
    } else {
      navigate(ROUTES.STUDENT_LOGIN);
    }
  };

  const handleRequests = () => {
    if (user) {
      navigate(ROUTES.MY_REQUESTS);
    } else {
      navigate(ROUTES.STUDENT_LOGIN);
    }
  };

  const handleUpload = () => {
    if (user) {
      navigate(ROUTES.POST_RESOURCE);
    } else {
      navigate(ROUTES.STUDENT_LOGIN);
    }
  };

  const initials = (userProfile?.fullName || 'U')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="landing">
      {/* Loader */}
      <div className="loader">
        <div className="overlay">
          <div className="block" />
          <div className="block" />
        </div>
        <div className="intro-logo">
          <div className="word" id="word-1"><h1><span>Gyana</span></h1></div>
          <div className="word" id="word-2"><h1>Setu</h1></div>
        </div>
        <div className="divider" />
        <div className="spinner-container"><div className="spinner" /></div>
        <div className="counter">
          {['00', '27', '65', '98', '99'].map((num, i) => (
            <div className="count" key={i}>
              {num.split('').map((d, j) => <div className="digit" key={j}><h1>{d}</h1></div>)}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="hero-bg">
          <Silk speed={4} scale={1} color="#ECEAF3" noiseIntensity={1.05} rotation={0} />
        </div>

        <nav className="nav">
          <a href={ROUTES.HOME} className="logo">
            <span className="brand-mark">📚</span>
            <span className="brand-name">GyanaSetu</span>
          </a>

          <div className="nav-links">
            <button type="button" onClick={handleBrowse}>Browse</button>
            <button type="button" onClick={handleRequests}>Requests</button>
            <button type="button" onClick={handleUpload}>Upload</button>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <button type="button" className="nav-icon" onClick={handleRequests} aria-label="Notifications">
                  <span className="badge">3</span>
                  <ion-icon name="notifications-outline" />
                </button>
                <button type="button" className="nav-avatar" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>{initials}</button>
              </>
            ) : (
              <button type="button" className="nav-btn" onClick={() => navigate(ROUTES.STUDENT_LOGIN)}>Sign In</button>
            )}
          </div>
        </nav>

        <section className="hero">
          <div className="pill">
            <span className="pill-icon">✦</span>
            <span>AI-Powered Resource Discovery</span>
          </div>

          <div className="hero-copy">
            <div className="line"><h1>Share Knowledge, <span className="accent">Grow</span></h1></div>
            <div className="line"><h1><span className="accent">Together</span></h1></div>
            <p className="line subtitle">
              The central hub for Hyderabad college students to discover, share, and request academic resources across departments and campuses.
            </p>
            <button type="button" className="cta" onClick={handleBrowse}>
              Go to Dashboard
              <ion-icon name="arrow-forward-outline" />
            </button>
          </div>

          <div className="stats">
              <div className="stat">
                <span className="val">
                  <Counter value={10} places={[10,1]} fontSize={40} padding={0} gap={2} textColor="#ffffff" fontWeight={900} gradientFrom="transparent" gradientTo="transparent" />
                  <span>+</span>
                </span>
                <span className="lbl">Colleges</span>
              </div>
              <div className="stat">
                <span className="val">
                  <Counter value={1000} places={[1000,100,10,1]} fontSize={40} padding={0} gap={2} textColor="#ffffff" fontWeight={900} gradientFrom="transparent" gradientTo="transparent" />
                  <span>+</span>
                </span>
                <span className="lbl">Resources</span>
              </div>
              <div className="stat">
                <span className="val">
                  <Counter value={5000} places={[1000,100,10,1]} fontSize={40} padding={0} gap={2} textColor="#ffffff" fontWeight={900} gradientFrom="transparent" gradientTo="transparent" />
                  <span>+</span>
                </span>
                <span className="lbl">Students</span>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
