import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import EventCard from '../components/events/EventCard';
import { eventsAPI } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);

      // Store original state for change detection
      const originals = {};
      data.forEach((event) => {
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

  const handleSave = async (updatedEvent) => {
    try {
      await eventsAPI.update(updatedEvent.id, updatedEvent);

      // Update events list
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
      await eventsAPI.delete(id);
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
            <button className="btn-add-new">
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
    </>
  );
};

export default EventsPage;
