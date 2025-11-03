import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { guestsAPI } from '../../services/api';

const AddGuestModal = ({ isOpen, onClose, onAddGuest, existingGuestIds = [] }) => {
  const [activeTab, setActiveTab] = useState('existing');
  const [allGuests, setAllGuests] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGuests();
    }
  }, [isOpen]);

  const loadGuests = async () => {
    try {
      const guests = await guestsAPI.getAll();
      setAllGuests(guests);
    } catch (error) {
      console.error('Error loading guests:', error);
    }
  };

  const handleAddExisting = () => {
    if (!selectedGuestId) {
      alert('Виберіть гостя зі списку');
      return;
    }

    const guest = allGuests.find((g) => g.id === selectedGuestId || g.id.toString() === selectedGuestId);
    if (guest) {
      onAddGuest(guest);
      setSelectedGuestId('');
      onClose();
    }
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();

    if (!newGuest.name.trim()) {
      alert('Введіть ім\'я гостя');
      return;
    }

    // Валідація довжини
    if (newGuest.name.length > 100) {
      alert('Ім\'я гостя не може бути довшим за 100 символів');
      return;
    }

    if (newGuest.email && newGuest.email.length > 100) {
      alert('Email не може бути довшим за 100 символів');
      return;
    }

    if (newGuest.telephone && newGuest.telephone.length > 20) {
      alert('Телефон не може бути довшим за 20 символів');
      return;
    }

    setLoading(true);

    try {
      const createdGuest = await guestsAPI.create(newGuest);
      onAddGuest(createdGuest);
      setNewGuest({ name: '', email: '', telephone: '' });
      onClose();
    } catch (error) {
      alert('Помилка створення гостя: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter out already added guests
  const availableGuests = allGuests.filter(
    (g) => !existingGuestIds.includes(g.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Додати гостя">
      <div className="modal-tabs">
        <button
          className={`tab-button ${activeTab === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveTab('existing')}
        >
          Вибрати існуючого
        </button>
        <button
          className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          Створити нового
        </button>
      </div>

      {activeTab === 'existing' ? (
        <div className="tab-content active">
          <div className="form-group">
            <label htmlFor="existing-guest-select">Виберіть гостя:</label>
            <select
              id="existing-guest-select"
              className="modal-select"
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
            >
              <option value="">-- Оберіть гостя --</option>
              {availableGuests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.name} {guest.email ? `(${guest.email})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            className="modal-btn modal-btn-primary"
            onClick={handleAddExisting}
            disabled={!selectedGuestId}
          >
            Додати
          </button>
        </div>
      ) : (
        <div className="tab-content active">
          <form onSubmit={handleCreateNew}>
            <div className="form-group">
              <label htmlFor="new-guest-name">Ім'я *</label>
              <input
                type="text"
                id="new-guest-name"
                required
                maxLength="100"
                placeholder="Ім'я гостя"
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-guest-email">Email</label>
              <input
                type="email"
                id="new-guest-email"
                maxLength="100"
                placeholder="email@example.com"
                value={newGuest.email}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-guest-phone">Телефон</label>
              <input
                type="tel"
                id="new-guest-phone"
                maxLength="20"
                placeholder="+380XXXXXXXXX"
                value={newGuest.telephone}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, telephone: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={loading}
            >
              {loading ? 'Створення...' : 'Створити і додати'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default AddGuestModal;
