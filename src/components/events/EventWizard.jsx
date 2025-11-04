import { useState, useEffect } from 'react';
import { eventsAPI, guestsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { localStorageUtils } from '../../utils/localStorage';
import AddressAutocomplete from '../common/AddressAutocomplete';
import CreateGuestModal from '../guests/CreateGuestModal';

const EventWizard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownValue, setDropdownValue] = useState('');
  const [allGuests, setAllGuests] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    date: '',
    location: '',
    budget: '',
    guestCount: '',
    description: '',
    options: {},
  });

  // Завантаження гостей при монтуванні компонента
  useEffect(() => {
    if (isAuthenticated()) {
      loadGuests();
    }
  }, []);

  const loadGuests = async () => {
    try {
      const guests = await guestsAPI.getAll();
      setAllGuests(guests);
    } catch (error) {
      console.error('Error loading guests:', error);
    }
  };

  const eventTypes = [
    { value: 'BIRTHDAY', label: 'День народження', icon: '🎂' },
    { value: 'WEDDING', label: 'Весілля', icon: '💍' },
    { value: 'CORPORATE', label: 'Корпоратив', icon: '🏢' },
    { value: 'ANNIVERSARY', label: 'Ювілей', icon: '🎊' },
    { value: 'NEW_YEAR', label: 'Новий рік', icon: '🎆' },
    { value: 'CHRISTMAS', label: 'Різдво', icon: '🎄' },
    { value: 'HALLOWEEN', label: 'Геллоуін', icon: '🎃' },
    { value: 'CHARITY', label: 'Благодійність', icon: '❤️' },
    { value: 'OTHER', label: 'Інше', icon: '📅' },
  ];

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

  const getEventHints = (type) => {
    const hints = {
      BIRTHDAY: {
        budgetHint: 'Зазвичай 5,000-20,000 грн',
        dateHint: 'Оберіть дату святкування',
        locationHint: 'Ресторан, кафе або вдома',
        descriptionPlaceholder: 'Опишіть тематику та побажання...',
      },
      WEDDING: {
        budgetHint: 'Середній бюджет 100,000-500,000 грн',
        dateHint: 'Зазвичай планується за 6-12 місяців',
        locationHint: 'Банкетний зал, ресторан, на природі',
        descriptionPlaceholder: 'Опишіть стиль весілля та особливі побажання...',
      },
      CORPORATE: {
        budgetHint: 'Залежить від розміру компанії',
        dateHint: 'Корпоративи часто наприкінці року',
        locationHint: 'Ресторан, заміський комплекс',
        descriptionPlaceholder: 'Мета заходу, кількість співробітників...',
      },
      ANNIVERSARY: {
        budgetHint: 'Зазвичай 10,000-50,000 грн',
        dateHint: 'Ювілейна дата святкування',
        locationHint: 'Ресторан, банкетний зал',
        descriptionPlaceholder: 'Опишіть ювілейну подію та побажання...',
      },
      NEW_YEAR: {
        budgetHint: 'Зазвичай 15,000-100,000 грн',
        dateHint: '31 грудня або 1 січня',
        locationHint: 'Ресторан, заміський комплекс, вдома',
        descriptionPlaceholder: 'Опишіть новорічне свято та побажання...',
      },
      CHRISTMAS: {
        budgetHint: 'Зазвичай 5,000-30,000 грн',
        dateHint: '25 грудня або 7 січня',
        locationHint: 'Вдома, ресторан, церква',
        descriptionPlaceholder: 'Опишіть різдвяне свято та побажання...',
      },
      HALLOWEEN: {
        budgetHint: 'Зазвичай 5,000-25,000 грн',
        dateHint: '31 жовтня',
        locationHint: 'Клуб, бар, вдома',
        descriptionPlaceholder: 'Опишіть тематику вечірки та костюми...',
      },
      CHARITY: {
        budgetHint: 'Залежить від масштабу події',
        dateHint: 'Оберіть зручну дату',
        locationHint: 'Конференц-зал, ресторан, на відкритому повітрі',
        descriptionPlaceholder: 'Опишіть благодійну подію та мету збору коштів...',
      },
      OTHER: {
        budgetHint: 'Вкажіть орієнтовний бюджет',
        dateHint: 'Оберіть зручну дату',
        locationHint: 'Вкажіть місце проведення',
        descriptionPlaceholder: 'Опишіть ваш захід...',
      },
    };
    return hints[type] || hints.OTHER;
  };

  const validateDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Дата не може бути в минулому';
    }

    // For weddings, suggest dates at least 3 months in the future
    if (formData.type === 'WEDDING') {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      if (selectedDate < threeMonthsFromNow) {
        return 'Рекомендуємо планувати весілля мінімум за 3 місяці';
      }
    }

    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('options.')) {
      const optionName = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [optionName]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const getTotalSteps = () => {
    return isAuthenticated() ? 5 : 4;
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, getTotalSteps()));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddOption = (e) => {
    const optionKey = e.target.value;
    if (optionKey && !selectedOptions.includes(optionKey)) {
      setSelectedOptions([...selectedOptions, optionKey]);
    }
    setDropdownValue(''); // Reset dropdown
  };

  const handleRemoveOption = (optionKey) => {
    setSelectedOptions(selectedOptions.filter((key) => key !== optionKey));
  };

  const handleAddGuest = (guestId) => {
    console.log('Adding guest with ID:', guestId, 'Type:', typeof guestId);
    if (guestId && !selectedGuests.includes(guestId)) {
      setSelectedGuests([...selectedGuests, guestId]);
    }
  };

  const handleRemoveGuest = (guestId) => {
    setSelectedGuests(selectedGuests.filter(id => id !== guestId));
  };

  const handleGuestCreated = (newGuest) => {
    setAllGuests(prev => [...prev, newGuest]);
    setSelectedGuests(prev => [...prev, newGuest.id]);
  };

  const handleSubmit = async () => {
    try {
      // Convert selectedOptions array to options array for backend
      const optionsArray = selectedOptions.map((key, index) => {
        const option = availableOptions.find(opt => opt.key === key);
        return {
          name: option.label,
          done: false,
          order: index
        };
      });

      const eventData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        guestCount: parseInt(formData.guestCount) || 0,
        options: optionsArray,
        guestIds: selectedGuests, // Відправляємо тільки масив ID гостей
      };

      if (isAuthenticated()) {
        // Користувач авторизований - зберігаємо на сервер
        await eventsAPI.create(eventData);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/events');
        }, 2000);
      } else {
        // Користувач не авторизований - зберігаємо локально
        localStorageUtils.saveLocalEvent(eventData);
        setShowLoginPrompt(true);
      }
    } catch (error) {
      alert('Помилка при створенні івенту');
      console.error(error);
    }
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
    navigate('/events');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const hints = getEventHints(formData.type);
  const dateError = formData.date ? validateDate(formData.date) : '';

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="wizard-step">
            <h3 className="wizard-step-title">Крок 1: Оберіть тип івента</h3>
            <div className="event-types-grid">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`event-type-card ${formData.type === type.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, type: type.value })}
                >
                  <span className="event-type-icon">{type.icon}</span>
                  <span className="event-type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="wizard-step">
            <h3 className="wizard-step-title">Крок 2: Основна інформація</h3>
            <div className="wizard-form-group">
              <label htmlFor="name">Назва івента *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={`Наприклад: ${formData.type === 'BIRTHDAY' ? 'День народження Олени' : formData.type === 'WEDDING' ? 'Весілля Марії та Андрія' : 'Назва вашого івента'}`}
                required
              />
            </div>

            <div className="wizard-form-group">
              <label htmlFor="date">Дата проведення *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <small className="form-hint">{hints.dateHint}</small>
              {dateError && <small className="form-error">{dateError}</small>}
            </div>

            <div className="wizard-form-group">
              <label htmlFor="location">Місце проведення *</label>
              <AddressAutocomplete
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value })}
                placeholder={hints.locationHint}
                required={true}
              />
              <small className="form-hint">Почніть вводити адресу, і з'являться підказки</small>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="wizard-step">
            <h3 className="wizard-step-title">Крок 3: Деталі та бюджет</h3>
            <div className="wizard-form-group">
              <label htmlFor="budget">Бюджет (грн)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="10000"
                min="0"
              />
              <small className="form-hint">{hints.budgetHint}</small>
            </div>

            <div className="wizard-form-group">
              <label htmlFor="guestCount">Кількість гостей</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                placeholder="50"
                min="1"
              />
            </div>

            <div className="wizard-form-group">
              <label htmlFor="description">Опис та побажання</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={hints.descriptionPlaceholder}
                rows="4"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="wizard-step">
            <h3 className="wizard-step-title">Крок 4: Додаткові опції</h3>
            <p className="wizard-step-description">
              Оберіть необхідні послуги та опції для вашого івента:
            </p>

            <div className="options-selector">
              <select className="options-dropdown" onChange={handleAddOption} value={dropdownValue}>
                <option value="" disabled>
                  Оберіть опцію...
                </option>
                {availableOptions
                  .filter((opt) => !selectedOptions.includes(opt.key))
                  .map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.icon} {option.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="selected-options-bubbles">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((optionKey) => {
                  const option = availableOptions.find((opt) => opt.key === optionKey);
                  return (
                    <div key={optionKey} className="option-bubble">
                      <span className="option-bubble-text">
                        {option.icon} {option.label}
                      </span>
                      <button
                        type="button"
                        className="option-bubble-remove"
                        onClick={() => handleRemoveOption(optionKey)}
                        aria-label={`Видалити ${option.label}`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="no-options-message">Опції ще не обрані. Оберіть зі списку вище.</p>
              )}
            </div>

            {!isAuthenticated() && (
              <div className="wizard-summary">
                <h4>Підсумок:</h4>
                <p><strong>Тип:</strong> {eventTypes.find(t => t.value === formData.type)?.label}</p>
                <p><strong>Назва:</strong> {formData.name}</p>
                <p><strong>Дата:</strong> {formData.date}</p>
                <p><strong>Місце:</strong> {formData.location}</p>
                {formData.budget && <p><strong>Бюджет:</strong> {formData.budget} грн</p>}
                {formData.guestCount && <p><strong>Гостей:</strong> {formData.guestCount}</p>}
                {selectedOptions.length > 0 && (
                  <p>
                    <strong>Опції:</strong>{' '}
                    {selectedOptions
                      .map((key) => availableOptions.find((opt) => opt.key === key)?.label)
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="wizard-step">
            <h3 className="wizard-step-title">Крок 5: Додайте гостей</h3>
            <p className="wizard-step-description">
              Оберіть гостей зі списку або створіть нових
            </p>

            <div className="guests-selection-section">
              <button
                type="button"
                className="btn-add-guest-wizard"
                onClick={() => setIsGuestModalOpen(true)}
              >
                <span className="btn-icon">+</span>
                Створити нового гостя
              </button>

              {allGuests.length > 0 ? (
                <>
                  <div className="available-guests-label">Доступні гості:</div>
                  <div className="available-guests-dropdown">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddGuest(e.target.value);
                        }
                      }}
                      className="guests-dropdown"
                    >
                      <option value="" disabled>
                        Оберіть гостя зі списку...
                      </option>
                      {allGuests
                        .filter(guest => !selectedGuests.includes(guest.id))
                        .map((guest) => (
                          <option key={guest.id} value={guest.id}>
                            👤 {guest.name} {guest.email ? `(${guest.email})` : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                <p className="no-guests-available">У вас ще немає гостей. Створіть першого!</p>
              )}

              <div className="selected-guests-bubbles">
                {selectedGuests.length > 0 ? (
                  selectedGuests.map((guestId) => {
                    const guest = allGuests.find(g => g.id === guestId);
                    if (!guest) return null;
                    return (
                      <div key={guestId} className="guest-bubble">
                        <span className="guest-bubble-text">
                          👤 {guest.name}
                        </span>
                        <button
                          type="button"
                          className="guest-bubble-remove"
                          onClick={() => handleRemoveGuest(guestId)}
                          aria-label={`Видалити ${guest.name}`}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-guests-selected">Гості ще не обрані. Оберіть зі списку вище.</p>
                )}
              </div>
            </div>

            <div className="wizard-summary">
              <h4>Підсумок:</h4>
              <p><strong>Тип:</strong> {eventTypes.find(t => t.value === formData.type)?.label}</p>
              <p><strong>Назва:</strong> {formData.name}</p>
              <p><strong>Дата:</strong> {formData.date}</p>
              <p><strong>Місце:</strong> {formData.location}</p>
              {formData.budget && <p><strong>Бюджет:</strong> {formData.budget} грн</p>}
              {formData.guestCount && <p><strong>Гостей:</strong> {formData.guestCount}</p>}
              {selectedOptions.length > 0 && (
                <p>
                  <strong>Опції:</strong>{' '}
                  {selectedOptions
                    .map((key) => availableOptions.find((opt) => opt.key === key)?.label)
                    .join(', ')}
                </p>
              )}
              {selectedGuests.length > 0 && (
                <p>
                  <strong>Запрошених гостей:</strong> {selectedGuests.length}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.type !== '';
      case 2:
        return formData.name && formData.date && formData.location && !dateError;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <section className="wizard-section">
      <div className="wizard-container">
        <h2 className="wizard-title">Створити новий івент</h2>

        <div className="wizard-progress">
          {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`wizard-progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            >
              <div className="wizard-progress-circle">{step}</div>
              <div className="wizard-progress-label">
                {step === 1 && 'Тип'}
                {step === 2 && 'Інформація'}
                {step === 3 && 'Деталі'}
                {step === 4 && (isAuthenticated() ? 'Опції' : 'Підсумок')}
                {step === 5 && 'Гості'}
              </div>
            </div>
          ))}
        </div>

        <form className="wizard-form">
          {renderStep()}

          <div className="wizard-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="wizard-btn wizard-btn-secondary"
                onClick={handlePrevious}
              >
                Назад
              </button>
            )}

            {currentStep < getTotalSteps() ? (
              <button
                type="button"
                className="wizard-btn wizard-btn-primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Далі
              </button>
            ) : (
              <button
                type="button"
                className="wizard-btn wizard-btn-success"
                onClick={handleSubmit}
                disabled={!canProceed()}
              >
                Створити івент
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Create Guest Modal */}
      <CreateGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onGuestCreated={handleGuestCreated}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay success-modal-overlay">
          <div className="modal-content success-modal-content">
            <div className="success-icon">✅</div>
            <h3 className="success-title">Івент успішно створено!</h3>
            <p className="success-message">Перенаправлення на сторінку івентів...</p>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal-overlay">
          <div className="modal-content login-prompt-modal">
            <h3 className="modal-title">✅ Івент створено!</h3>
            <p className="modal-text">
              Ваш івент збережено локально. Щоб зберегти його назавжди та отримати доступ з будь-якого пристрою,
              рекомендуємо увійти в акаунт.
            </p>
            <p className="modal-highlight">
              💡 При вході всі створені івенти автоматично прив'яжуться до вашого акаунту!
            </p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-primary" onClick={handleGoToLogin}>
                Увійти в акаунт
              </button>
              <button className="modal-btn modal-btn-secondary" onClick={handleLoginPromptClose}>
                Продовжити без входу
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventWizard;
