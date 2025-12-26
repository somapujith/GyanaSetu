import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Silk from '../components/Silk';
import { useLoaderAnimation } from '../hooks/useLoaderAnimation';
import '../styles.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useLoaderAnimation();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <div className="loader">
        <div className="overlay">
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div className="intro-logo">
          <div className="word" id="word-1">
            <h1><span>Gyana</span></h1>
          </div>
          <div className="word" id="word-2"><h1>Setu</h1></div>
        </div>

        <div className="divider"></div>

        <div className="spinner-container">
          <div className="spinner"></div>
        </div>

        <div className="counter">
          <div className="count">
            <div className="digit"><h1>0</h1></div>
            <div className="digit"><h1>0</h1></div>
          </div>
          <div className="count">
            <div className="digit"><h1>2</h1></div>
            <div className="digit"><h1>7</h1></div>
          </div>
          <div className="count">
            <div className="digit"><h1>6</h1></div>
            <div className="digit"><h1>5</h1></div>
          </div>
          <div className="count">
            <div className="digit"><h1>9</h1></div>
            <div className="digit"><h1>8</h1></div>
          </div>
          <div className="count">
            <div className="digit"><h1>9</h1></div>
            <div className="digit"><h1>9</h1></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-img">
          <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
        </div>

        <div className="nav">
          <div className="logo">
            <a href="/">Gyana Setu</a>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="btn">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="nav-btn">
                Dashboard
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="nav-btn">
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="header">
          <div className="hero-copy">
            <div className="line">
              <h1><span>Share</span> Resources,</h1>
            </div>
            <div className="line">
              <h1>build <span>community</span></h1>
            </div>
            </div>
            <div className="line">
              <p>Connect with students across Hyderabad colleges and share books, notes, and lab equipment</p>
            </div>
        </div>

        <div className="cta">
          <div className="cta-label" onClick={handleGetStarted} style={{ cursor: 'pointer' }}>
            <p>Get Started</p>
          </div>
          <div className="cta-icon" onClick={handleGetStarted} style={{ cursor: 'pointer' }}>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
