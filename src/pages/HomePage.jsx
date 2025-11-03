import Header from '../components/common/Header';

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="hero-container">
        <div className="hero-content">
          <div className="slider">
            <div className="slide active">
              <h2 className="neon">Create Memorable Events with Ease</h2>
            </div>
          </div>
        </div>
      </main>

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
