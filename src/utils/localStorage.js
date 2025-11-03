const LOCAL_EVENTS_KEY = 'local_events';

export const localStorageUtils = {
  // Отримати всі локальні івенти
  getLocalEvents: () => {
    try {
      const events = localStorage.getItem(LOCAL_EVENTS_KEY);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error('Error reading local events:', error);
      return [];
    }
  },

  // Зберегти івент локально
  saveLocalEvent: (event) => {
    try {
      const events = localStorageUtils.getLocalEvents();
      const newEvent = {
        ...event,
        id: `local_${Date.now()}`,
        isLocal: true,
        createdAt: new Date().toISOString(),
      };
      events.push(newEvent);
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
      return newEvent;
    } catch (error) {
      console.error('Error saving local event:', error);
      return null;
    }
  },

  // Видалити локальний івент
  deleteLocalEvent: (id) => {
    try {
      const events = localStorageUtils.getLocalEvents();
      const filtered = events.filter((e) => e.id !== id);
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting local event:', error);
      return false;
    }
  },

  // Оновити локальний івент
  updateLocalEvent: (id, updatedData) => {
    try {
      const events = localStorageUtils.getLocalEvents();
      const updated = events.map((e) => (e.id === id ? { ...e, ...updatedData } : e));
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error updating local event:', error);
      return false;
    }
  },

  // Очистити всі локальні івенти
  clearLocalEvents: () => {
    try {
      localStorage.removeItem(LOCAL_EVENTS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing local events:', error);
      return false;
    }
  },

  // Перевірити чи є локальні івенти
  hasLocalEvents: () => {
    return localStorageUtils.getLocalEvents().length > 0;
  },
};
