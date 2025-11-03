import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { guestsAPI } from '../services/api';

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const data = await guestsAPI.getAll();
      setGuests(data);
    } catch (err) {
      setError('Помилка завантаження гостей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <>
      <Header />
      <section className="guests-page">
        <div className="guests-page-container">
          <div className="page-header">
            <h1 className="page-title">Мої гості</h1>
            <button className="btn-add-new">
              <span className="btn-icon">+</span>
              Додати гостя
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="guests-grid">
            {guests.length === 0 ? (
              <div className="empty-state">
                <h2>У вас ще немає жодного гостя</h2>
                <p>Додайте свого першого гостя прямо зараз!</p>
              </div>
            ) : (
              guests.map((guest) => (
                <div key={guest.id} className="guest-card">
                  <div className="guest-card-header">
                    <h3 className="guest-card-name">{guest.name}</h3>
                  </div>
                  <div className="guest-card-details">
                    {guest.email && (
                      <p className="guest-card-info">
                        <span className="info-icon">📧</span>
                        <span className="info-text">{guest.email}</span>
                      </p>
                    )}
                    {guest.telephone && (
                      <p className="guest-card-info">
                        <span className="info-icon">📱</span>
                        <span className="info-text">{guest.telephone}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default GuestsPage;
