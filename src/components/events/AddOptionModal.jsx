import { useState } from 'react';
import Modal from '../common/Modal';

const AddOptionModal = ({ isOpen, onClose, onAddOption }) => {
  const [optionName, setOptionName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!optionName.trim()) {
      alert('Введіть назву опції');
      return;
    }

    setLoading(true);

    try {
      // Create new option object
      const newOption = {
        name: optionName.trim(),
        completed: false,
      };

      onAddOption(newOption);
      setOptionName('');
    } catch (error) {
      alert('Помилка додавання опції');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Додати опцію">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="new-option-name">Назва опції *</label>
          <input
            type="text"
            id="new-option-name"
            required
            placeholder="Назва завдання"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="modal-btn modal-btn-primary"
          disabled={loading}
        >
          {loading ? 'Додавання...' : 'Створити'}
        </button>
      </form>
    </Modal>
  );
};

export default AddOptionModal;
