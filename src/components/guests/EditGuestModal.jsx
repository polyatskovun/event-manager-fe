import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { guestsAPI } from '../../services/api';

const EditGuestModal = ({ isOpen, onClose, guest, onGuestUpdated }) => {
  const [editedGuest, setEditedGuest] = useState({
    name: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guest) {
      setEditedGuest({
        name: guest.name || '',
        email: guest.email || '',
        telephone: guest.telephone || '',
      });
    }
  }, [guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editedGuest.name.trim()) {
      alert('Введіть ім\'я гостя');
      return;
    }

    // Валідація довжини
    if (editedGuest.name.length > 100) {
      alert('Ім\'я гостя не може бути довшим за 100 символів');
      return;
    }

    if (editedGuest.email && editedGuest.email.length > 100) {
      alert('Email не може бути довшим за 100 символів');
      return;
    }

    if (editedGuest.telephone && editedGuest.telephone.length > 20) {
      alert('Телефон не може бути довшим за 20 символів');
      return;
    }

    setLoading(true);

    try {
      const updatedGuest = await guestsAPI.update(guest.id, editedGuest);
      onGuestUpdated(updatedGuest);
      onClose();
    } catch (error) {
      alert('Помилка оновлення гостя: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!guest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редагувати гостя">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-guest-name">Ім'я *</label>
          <input
            type="text"
            id="edit-guest-name"
            required
            maxLength="100"
            placeholder="Ім'я гостя"
            value={editedGuest.name}
            onChange={(e) =>
              setEditedGuest({ ...editedGuest, name: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-guest-email">Email</label>
          <input
            type="email"
            id="edit-guest-email"
            maxLength="100"
            placeholder="email@example.com"
            value={editedGuest.email}
            onChange={(e) =>
              setEditedGuest({ ...editedGuest, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-guest-phone">Телефон</label>
          <input
            type="tel"
            id="edit-guest-phone"
            maxLength="20"
            placeholder="+380XXXXXXXXX"
            value={editedGuest.telephone}
            onChange={(e) =>
              setEditedGuest({ ...editedGuest, telephone: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="modal-btn modal-btn-primary"
          disabled={loading}
        >
          {loading ? 'Збереження...' : 'Зберегти зміни'}
        </button>
      </form>
    </Modal>
  );
};

export default EditGuestModal;
