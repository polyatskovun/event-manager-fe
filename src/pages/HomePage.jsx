import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    'Create Memorable Events with Ease',
    'Plan Your Perfect Celebration',
    'Manage Guests and Invitations Effortlessly',
    'Track Your Event Budget in Real-Time',
    'Make Every Moment Count',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <>
      <Header />
      <main className="hero-container">
        <div className="hero-content">
          <div className="slider">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <h2 className="neon">{slide}</h2>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Готові створити незабутній івент?</h2>
          <p className="cta-description">
            Розпочніть планування вашого ідеального заходу за декілька простих кроків
          </p>
          <button className="cta-button" onClick={handleCreateEvent}>
            <span className="cta-icon">✨</span>
            Створити івент
          </button>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">15,247</div>
            <div className="stat-label">Events Created</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12,500+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Countries Served</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
