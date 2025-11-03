import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleHomeClick = (e) => {
    if (isDropdownOpen) {
      e.preventDefault();
    }
    closeDropdown();
  };

  return (
    <header>
      <img src="/assets/img/logo.png" alt="Event manager logo" className="logo" />
      <nav>
        <ul>
          <li className="dropdown" onMouseLeave={closeDropdown}>
            <Link
              to="/"
              className={`dropdown-toggle ${location.pathname === '/' ? 'active' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onClick={handleHomeClick}
            >
              Home
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </Link>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <a href="#statistics" onClick={closeDropdown}>Statistics</a>
                </li>
                <li>
                  <a href="#contacts" onClick={closeDropdown}>Contacts</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
              My Events
            </Link>
          </li>
          <li>
            <Link to="/guests" className={location.pathname === '/guests' ? 'active' : ''}>
              Guests
            </Link>
          </li>
        </ul>
      </nav>
      <div className="header-auth">
        {isAuthenticated() && user && (
          <span className="user-display">Привіт, {user.username}!</span>
        )}
        <button onClick={isAuthenticated() ? handleLogout : handleLogin}>
          {isAuthenticated() ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
};

export default Header;
