import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header>
      <img
        src="/assets/img/blob-haikei.svg"
        alt="Event manager logo bg"
        className="logo-bg"
      />
      <img src="/assets/img/logo.png" alt="Event manager logo" className="logo" />

      <h1>Event manager</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/events">My Events</Link>
          </li>
          <li>
            <Link to="/guests">Guests</Link>
          </li>
          <li>
            <a href="#">Statistics</a>
          </li>
          <li>
            <a href="#">Contacts</a>
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
