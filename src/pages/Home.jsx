import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import VariableProximity from '../components/VariableProximity';
import LightPillar from '../components/LightPillar';

import { ROUTES } from '../constants/routes';
import '../styles/landing.css';
import Counter from '../components/Counter';

export default function Home() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const heroContainerRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('skip-loader');
    return () => document.body.classList.remove('skip-loader');
  }, []);



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
      <div className="hero-bg">
        <LightPillar
          topColor="#6366f1"
          bottomColor="#a855f7"
          intensity={0.8}
          rotationSpeed={0.3}
          glowAmount={0.005}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="screen"
        />
      </div>
      <div className="container">


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
                <button type="button" className="nav-avatar" onClick={() => navigate(ROUTES.PROFILE)} title="Profile">
                  {initials}
                </button>
                <button type="button" className="nav-profile" onClick={() => navigate(ROUTES.PROFILE)} title="Profile">
                  <ion-icon name="person-circle-outline" style={{ fontSize: 28, verticalAlign: 'middle' }} />
                </button>
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

          <div className="hero-copy" ref={heroContainerRef} style={{ position: 'relative' }}>
            <div className="line">
              <VariableProximity
                label="Share Knowledge,"
                className="hero-variable-text"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={heroContainerRef}
                radius={100}
                falloff="linear"
              />
            </div>
            <div className="line">
              <VariableProximity
                label="Grow"
                className="hero-variable-text accent"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={heroContainerRef}
                radius={100}
                falloff="linear"
              />
            </div>
            <div className="line">
              <VariableProximity
                label="Together"
                className="hero-variable-text accent"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={heroContainerRef}
                radius={100}
                falloff="linear"
              />
            </div>
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
