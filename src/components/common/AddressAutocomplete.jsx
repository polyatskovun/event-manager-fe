import { useState, useEffect, useRef } from 'react';

const AddressAutocomplete = ({ value, onChange, placeholder, required }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Використовуємо Nominatim API від OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `limit=5&` +
        `addressdetails=1&` +
        `countrycodes=ua&` +
        `accept-language=uk`,
        {
          headers: {
            'User-Agent': 'EventManagerApp/1.0'
          }
        }
      );

      const data = await response.json();

      setSuggestions(data.map(item => ({
        displayName: item.display_name,
        address: item.address,
        fullAddress: item.display_name,
      })));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.fullAddress);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="address-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />

      {isLoading && (
        <div className="address-autocomplete-loading">
          <span className="loading-spinner">🔍</span> Пошук адрес...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <ul className="address-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="address-suggestion-item"
            >
              <span className="suggestion-icon">📍</span>
              <span className="suggestion-text">{suggestion.displayName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
