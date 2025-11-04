import { useState } from 'react';
import Modal from '../common/Modal';
import { guestsAPI } from '../../services/api';

const CreateGuestModal = ({ isOpen, onClose, onGuestCreated }) => {
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      onGuestCreated(createdGuest);
      setNewGuest({ name: '', email: '', telephone: '' });
      onClose();
    } catch (error) {
      alert('Помилка створення гостя: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewGuest({ name: '', email: '', telephone: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Створити нового гостя">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guest-name">Ім'я *</label>
          <input
            type="text"
            id="guest-name"
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
          <label htmlFor="guest-email">Email</label>
          <input
            type="email"
            id="guest-email"
            maxLength="100"
            placeholder="email@example.com"
            value={newGuest.email}
            onChange={(e) =>
              setNewGuest({ ...newGuest, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="guest-phone">Телефон</label>
          <input
            type="tel"
            id="guest-phone"
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
          {loading ? 'Створення...' : 'Створити гостя'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateGuestModal;
