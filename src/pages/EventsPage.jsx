import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import EventCard from '../components/events/EventCard';
import { eventsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { localStorageUtils } from '../utils/localStorage';

const EventsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Перевірити чи є локальні івенти та чи користувач авторизований
    if (isAuthenticated() && localStorageUtils.hasLocalEvents()) {
      setShowSyncPrompt(true);
    }
  }, [isAuthenticated]);

  const loadEvents = async () => {
    try {
      let allEvents = [];

      if (isAuthenticated()) {
        // Завантажити івенти з сервера
        const serverEvents = await eventsAPI.getAll();
        allEvents = serverEvents;
      } else {
        // Завантажити локальні івенти
        const localEvents = localStorageUtils.getLocalEvents();
        allEvents = localEvents;
      }

      setEvents(allEvents);

      // Store original state for change detection
      const originals = {};
      allEvents.forEach((event) => {
        originals[event.id] = JSON.parse(JSON.stringify(event));
      });
      setOriginalEvents(originals);
    } catch (err) {
      setError('Помилка завантаження івентів');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const syncLocalEventsToServer = async () => {
    setSyncing(true);
    try {
      const localEvents = localStorageUtils.getLocalEvents();

      // Створити всі локальні івенти на сервері
      for (const event of localEvents) {
        const { id, isLocal, createdAt, ...eventData } = event;
        await eventsAPI.create(eventData);
      }

      // Очистити локальні івенти після успішної синхронізації
      localStorageUtils.clearLocalEvents();
      setShowSyncPrompt(false);

      // Перезавантажити івенти з сервера
      await loadEvents();
      alert(`Успішно синхронізовано ${localEvents.length} івент(ів)!`);
    } catch (err) {
      alert('Помилка синхронізації івентів');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (updatedEvent) => {
    try {
      if (updatedEvent.isLocal) {
        // Оновити локальний івент
        localStorageUtils.updateLocalEvent(updatedEvent.id, updatedEvent);
      } else {
        // Підготувати дані для бекенду - видалити тимчасові id
        const eventDataForBackend = {
          ...updatedEvent,
          options: updatedEvent.options?.map(option => {
            // Якщо id це число (тимчасовий id), видаляємо його
            if (typeof option.id === 'number') {
              const { id, ...optionWithoutId } = option;
              return optionWithoutId;
            }
            return option;
          }),
          guests: updatedEvent.guests?.map(guest => {
            // Якщо id це число (тимчасовий id), видаляємо його
            if (typeof guest.id === 'number') {
              const { id, ...guestWithoutId } = guest;
              return guestWithoutId;
            }
            return guest;
          })
        };

        // Оновити івент на сервері і отримати оновлені дані з правильними UUID
        const savedEvent = await eventsAPI.update(updatedEvent.id, eventDataForBackend);

        // Update events list with saved data from backend
        setEvents(events.map((e) => (e.id === updatedEvent.id ? savedEvent : e)));

        // Update original state with backend data
        setOriginalEvents((prev) => ({
          ...prev,
          [savedEvent.id]: JSON.parse(JSON.stringify(savedEvent)),
        }));

        return; // Exit early to avoid duplicate state updates
      }

      // Update events list (for local events)
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));

      // Update original state
      setOriginalEvents((prev) => ({
        ...prev,
        [updatedEvent.id]: JSON.parse(JSON.stringify(updatedEvent)),
      }));
    } catch (err) {
      alert('Помилка збереження івенту');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Ви впевнені, що хочете видалити цей івент?')) return;

    try {
      const event = events.find((e) => e.id === id);

      if (event?.isLocal) {
        // Видалити локальний івент
        localStorageUtils.deleteLocalEvent(id);
      } else {
        // Видалити івент з сервера
        await eventsAPI.delete(id);
      }

      setEvents(events.filter((e) => e.id !== id));

      // Remove from original state
      setOriginalEvents((prev) => {
        const newOriginals = { ...prev };
        delete newOriginals[id];
        return newOriginals;
      });
    } catch (err) {
      alert('Помилка видалення івенту');
      console.error(err);
    }
  };

  // Get unique event types for filter
  const uniqueTypes = [...new Set(events.map((e) => e.type))];

  // Filter and sort events
  const getFilteredAndSortedEvents = () => {
    let filtered = [...events];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((e) => e.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(b.date) - new Date(a.date);
        case 'date-desc':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'budget':
          return (b.budget || 0) - (a.budget || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredEvents = getFilteredAndSortedEvents();

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>Завантаження...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="events-page">
        <div className="events-page-container">
          <div className="page-header">
            <h1 className="page-title">Мої івенти</h1>
            <button className="btn-add-new" onClick={() => navigate('/create-event')}>
              <span className="btn-icon">+</span>
              Створити івент
            </button>
          </div>

          {events.length > 0 && (
            <div className="events-filter">
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Всі типи</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-asc">За датою (спочатку нові)</option>
                <option value="date-desc">За датою (спочатку старі)</option>
                <option value="name">За назвою</option>
                <option value="budget">За бюджетом</option>
              </select>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div id="events-list" className="events-grid">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" stroke="#667eea" strokeWidth="4" fill="none" />
                  <path
                    d="M40 60L55 75L80 45"
                    stroke="#667eea"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2>Ви ще не створили жодного івенту</h2>
                <p>Почніть планувати свої події прямо зараз!</p>
                <div className="empty-state-actions">
                  <button className="btn-create-event" onClick={() => navigate('/create-event')}>
                    Створити івент
                  </button>
                  {!isAuthenticated() && (
                    <button className="btn-login" onClick={() => navigate('/login')}>
                      Увійти в акаунт
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  originalEvent={originalEvents[event.id]}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Sync Prompt Modal */}
      {showSyncPrompt && (
        <div className="modal-overlay">
          <div className="modal-content sync-prompt-modal">
            <h3 className="modal-title">🔄 Синхронізація івентів</h3>
            <p className="modal-text">
              Знайдено {localStorageUtils.getLocalEvents().length} локальних івент(ів), створених до входу в акаунт.
            </p>
            <p className="modal-highlight">
              💾 Бажаєте синхронізувати їх з вашим акаунтом? Це дозволить отримати доступ до них з будь-якого пристрою.
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-primary"
                onClick={syncLocalEventsToServer}
                disabled={syncing}
              >
                {syncing ? 'Синхронізація...' : 'Синхронізувати'}
              </button>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => setShowSyncPrompt(false)}
                disabled={syncing}
              >
                Не зараз
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
