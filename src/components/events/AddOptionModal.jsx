import { useState } from 'react';
import Modal from '../common/Modal';

const AddOptionModal = ({ isOpen, onClose, onAddOption }) => {
  const [activeTab, setActiveTab] = useState('preset');
  const [selectedPresetOption, setSelectedPresetOption] = useState('');
  const [optionName, setOptionName] = useState('');
  const [loading, setLoading] = useState(false);

  const availableOptions = [
    { key: 'catering', label: 'Кейтеринг', icon: '🍽️' },
    { key: 'entertainment', label: 'Розваги/Музика', icon: '🎵' },
    { key: 'photography', label: 'Фото/Відео зйомка', icon: '📸' },
    { key: 'decoration', label: 'Декорації', icon: '🎨' },
    { key: 'dj', label: 'DJ', icon: '🎧' },
    { key: 'liveBand', label: 'Жива музика/Гурт', icon: '🎸' },
    { key: 'host', label: 'Ведучий', icon: '🎤' },
    { key: 'soundSystem', label: 'Звукова система', icon: '🔊' },
    { key: 'lighting', label: 'Освітлення', icon: '💡' },
    { key: 'bartending', label: 'Барна стійка/Бармен', icon: '🍹' },
    { key: 'cake', label: 'Торт/Десерти', icon: '🎂' },
    { key: 'florist', label: 'Флорист/Квіти', icon: '💐' },
    { key: 'security', label: 'Охорона', icon: '🛡️' },
    { key: 'parking', label: 'Парковка/Valet', icon: '🚗' },
    { key: 'transportation', label: 'Транспорт для гостей', icon: '🚌' },
    { key: 'accommodation', label: 'Розміщення гостей', icon: '🏨' },
    { key: 'invitations', label: 'Запрошення/Друк', icon: '💌' },
    { key: 'gifts', label: 'Подарунки/Бонбоньєрки', icon: '🎁' },
    { key: 'animator', label: 'Аніматор', icon: '🤹' },
    { key: 'fireworks', label: 'Феєрверк/Салют', icon: '🎆' },
  ];

  const handleAddPreset = () => {
    if (!selectedPresetOption) {
      alert('Оберіть опцію зі списку');
      return;
    }

    const option = availableOptions.find((opt) => opt.key === selectedPresetOption);
    if (option) {
      const newOption = {
        name: option.label,
        done: false,
      };
      onAddOption(newOption);
      setSelectedPresetOption('');
      onClose();
    }
  };

  const handleCreateCustom = async (e) => {
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
        done: false,
      };

      onAddOption(newOption);
      setOptionName('');
      onClose();
    } catch (error) {
      alert('Помилка додавання опції');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Додати опцію">
      <div className="modal-tabs">
        <button
          className={`tab-button ${activeTab === 'preset' ? 'active' : ''}`}
          onClick={() => setActiveTab('preset')}
        >
          Вибрати заготовлену
        </button>
        <button
          className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Створити власну
        </button>
      </div>

      {activeTab === 'preset' ? (
        <div className="tab-content active">
          <div className="form-group">
            <label htmlFor="preset-option-select">Виберіть опцію:</label>
            <select
              id="preset-option-select"
              className="modal-select"
              value={selectedPresetOption}
              onChange={(e) => setSelectedPresetOption(e.target.value)}
            >
              <option value="">-- Оберіть опцію --</option>
              {availableOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="modal-btn modal-btn-primary"
            onClick={handleAddPreset}
            disabled={!selectedPresetOption}
          >
            Додати
          </button>
        </div>
      ) : (
        <div className="tab-content active">
          <form onSubmit={handleCreateCustom}>
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
              {loading ? 'Додавання...' : 'Створити і додати'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default AddOptionModal;
