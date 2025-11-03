import { useState, useEffect } from 'react';
import { getTypeBadgeClass, getTypeLabel, formatDate, formatTime, generateGoogleCalendarLink } from '../../utils/helpers';
import AddGuestModal from './AddGuestModal';
import AddOptionModal from './AddOptionModal';

const EventCard = ({ event, onSave, onDelete, originalEvent }) => {
  const [editedEvent, setEditedEvent] = useState(event);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);

  useEffect(() => {
    // Check if there are any changes
    const changed = JSON.stringify(editedEvent) !== JSON.stringify(originalEvent);
    setHasChanges(changed);
  }, [editedEvent, originalEvent]);

  const handleAddToCalendar = () => {
    const calendarLink = generateGoogleCalendarLink(event);
    if (calendarLink) {
      window.open(calendarLink, '_blank');
    }
  };

  const handleSave = () => {
    onSave(editedEvent);
    setHasChanges(false);
  };

  const handleOptionToggle = (optionId) => {
    setEditedEvent((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, completed: !opt.completed } : opt
      ),
    }));
  };

  const handleRemoveGuest = (guestId) => {
    setEditedEvent((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== guestId),
    }));
  };

  const handleRemoveOption = (optionId) => {
    setEditedEvent((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== optionId),
    }));
  };

  const handleAddGuest = () => {
    setShowAddGuestModal(true);
  };

  const handleAddGuestToEvent = (guest) => {
    // Check if guest is already added
    if (editedEvent.guests?.some((g) => g.id === guest.id)) {
      alert('Цей гість вже доданий до івенту');
      return;
    }

    setEditedEvent((prev) => ({
      ...prev,
      guests: [...(prev.guests || []), guest],
    }));
    setShowAddGuestModal(false);
  };

  const handleAddOption = () => {
    setShowAddOptionModal(true);
  };

  const handleAddOptionToEvent = (optionData) => {
    // Generate temporary ID for new option (will be replaced by backend)
    const newOption = {
      ...optionData,
      id: Date.now(), // Temporary ID
    };

    setEditedEvent((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOption],
    }));
    setShowAddOptionModal(false);
  };

  return (
    <div className="event-card">
      <div className="event-card-backdrop"></div>
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-title">{editedEvent.name}</h3>
          <span className={`event-type-badge ${getTypeBadgeClass(editedEvent.type)}`}>
            {getTypeLabel(editedEvent.type)}
          </span>
        </div>

        <div className="event-card-body">
          <div className="event-info">
            <div className="info-item">
              <span className="info-label">📅 Дата:</span>
              <span className="info-value">{formatDate(editedEvent.date)}</span>
            </div>
            {editedEvent.time && (
              <div className="info-item">
                <span className="info-label">🕐 Час:</span>
                <span className="info-value">{formatTime(editedEvent.time)}</span>
              </div>
            )}
            {editedEvent.location && (
              <div className="info-item">
                <span className="info-label">📍 Локація:</span>
                <span className="info-value">{editedEvent.location}</span>
              </div>
            )}
            {editedEvent.budget && (
              <div className="info-item">
                <span className="info-label">💰 Бюджет:</span>
                <span className="info-value">{editedEvent.budget} грн</span>
              </div>
            )}
            {editedEvent.duration && (
              <div className="info-item">
                <span className="info-label">⏱️ Тривалість:</span>
                <span className="info-value">{editedEvent.duration} год</span>
              </div>
            )}
          </div>

          {editedEvent.description && (
            <div className="event-description">
              <p>{editedEvent.description}</p>
            </div>
          )}

          <div className="event-guests">
            <div className="section-header">
              <h4>Гості ({editedEvent.guests?.length || 0}):</h4>
              <button className="btn-add-item" onClick={handleAddGuest} title="Додати гостя">
                ➕
              </button>
            </div>
            {editedEvent.guests && editedEvent.guests.length > 0 ? (
              <div className="guests-list">
                {editedEvent.guests.map((guest) => (
                  <div key={guest.id} className="guest-item">
                    <span className="guest-tag">{guest.name}</span>
                    <button
                      className="btn-remove-guest"
                      onClick={() => handleRemoveGuest(guest.id)}
                      title="Видалити гостя"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Немає гостей</p>
            )}
          </div>

          <div className="event-options">
            <div className="section-header">
              <h4>Опції ({editedEvent.options?.length || 0}):</h4>
              <button className="btn-add-item" onClick={handleAddOption} title="Додати опцію">
                ➕
              </button>
            </div>
            {editedEvent.options && editedEvent.options.length > 0 ? (
              <div className="options-list">
                {editedEvent.options.map((option) => (
                  <div key={option.id} className="option-item">
                    <input
                      type="checkbox"
                      checked={option.completed}
                      onChange={() => handleOptionToggle(option.id)}
                    />
                    <span className={option.completed ? 'completed' : ''}>
                      {option.name}
                    </span>
                    <button
                      className="btn-remove-option"
                      onClick={() => handleRemoveOption(option.id)}
                      title="Видалити опцію"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Немає опцій</p>
            )}
          </div>
        </div>

        <div className="event-card-actions">
          {hasChanges && (
            <button className="event-btn event-btn-save" onClick={handleSave}>
              💾 Зберегти
            </button>
          )}
          <button className="event-btn event-btn-calendar" onClick={handleAddToCalendar}>
            📅 Google Calendar
          </button>
          <button className="event-btn event-btn-delete" onClick={() => onDelete(event.id)}>
            🗑️ Видалити
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddGuestModal
        isOpen={showAddGuestModal}
        onClose={() => setShowAddGuestModal(false)}
        onAddGuest={handleAddGuestToEvent}
        existingGuestIds={editedEvent.guests?.map((g) => g.id) || []}
      />

      <AddOptionModal
        isOpen={showAddOptionModal}
        onClose={() => setShowAddOptionModal(false)}
        onAddOption={handleAddOptionToEvent}
      />
    </div>
  );
};

export default EventCard;
