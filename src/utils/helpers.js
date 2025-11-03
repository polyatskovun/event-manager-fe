// Event type labels
export const EVENT_TYPE_LABELS = {
  BIRTHDAY: 'День народження',
  WEDDING: 'Весілля',
  CORPORATE: 'Корпоратив',
  CONFERENCE: 'Конференція',
  PARTY: 'Вечірка',
  CHARITY: 'Благодійність',
  OTHER: 'Інше',
};

// Get event type label
export const getTypeLabel = (type) => EVENT_TYPE_LABELS[type] || type;

// Get event type badge class
export const getTypeBadgeClass = (type) => {
  const typeClasses = {
    BIRTHDAY: 'badge-birthday',
    WEDDING: 'badge-wedding',
    CORPORATE: 'badge-corporate',
    CONFERENCE: 'badge-conference',
    PARTY: 'badge-party',
    CHARITY: 'badge-charity',
    OTHER: 'badge-other',
  };
  return typeClasses[type] || 'badge-other';
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5);
};

// Generate Google Calendar link
export const generateGoogleCalendarLink = (event) => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const title = encodeURIComponent(event.name);

  let startDate, endDate;
  if (event.date && event.time) {
    const eventDate = new Date(`${event.date}T${event.time}`);
    startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const duration = event.duration || 2;
    const endDateTime = new Date(eventDate.getTime() + duration * 60 * 60 * 1000);
    endDate = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } else if (event.date) {
    startDate = event.date.replace(/-/g, '');
    endDate = startDate;
  } else {
    return null;
  }

  let url = `${baseUrl}&text=${title}&dates=${startDate}/${endDate}`;

  if (event.location) {
    url += `&location=${encodeURIComponent(event.location)}`;
  }
  if (event.description) {
    url += `&details=${encodeURIComponent(event.description)}`;
  }

  return url;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
