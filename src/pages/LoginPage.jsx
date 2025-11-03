import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/events');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', password: '', remember: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (isRegisterMode) {
      if (!formData.username || !formData.email || !formData.password) {
        setError('Будь ласка, заповніть всі поля');
        return;
      }
    } else {
      if (!formData.username || !formData.password) {
        setError('Будь ласка, заповніть всі поля');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccess('Реєстрація успішна! Тепер ви можете увійти.');
        setTimeout(() => {
          setIsRegisterMode(false);
          setFormData({ username: formData.username, email: formData.email, password: '', remember: false });
        }, 2000);
      } else {
        await login({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (formData.remember) {
          localStorage.setItem('rememberMe', 'true');
        }

        setSuccess('Успішний вхід! Перенаправлення...');
        setTimeout(() => {
          navigate('/events');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Помилка при виконанні операції');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <img src="/assets/img/blob-haikei.svg" alt="Event manager logo bg" className="logo-bg" />
        <img src="/assets/img/logo.png" alt="Event manager logo" className="logo" />
        <h1>Event manager</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/events">My Events</a></li>
            <li><a href="/guests">Guests</a></li>
            <li><a href="#">Statistics</a></li>
            <li><a href="#">Contacts</a></li>
          </ul>
        </nav>
        <button onClick={() => navigate('/login')}>Login</button>
      </header>

      <main className="login-container">
        <div className="login-card">
          <h2 className="login-title">
            {isRegisterMode ? 'Реєстрація' : 'Вхід до системи'}
          </h2>
          <p className="login-subtitle">
            {isRegisterMode
              ? 'Створіть обліковий запис для керування івентами'
              : 'Увійдіть, щоб керувати своїми івентами'}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                {isRegisterMode ? "Ім'я користувача" : "Ім'я користувача або Email"}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder={
                  isRegisterMode ? "Введіть ім'я користувача" : "Введіть ім'я користувача або email"
                }
                autoComplete="username"
              />
            </div>

            {isRegisterMode && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Введіть email"
                  autoComplete="email"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Введіть пароль"
                autoComplete="current-password"
              />
            </div>

            {!isRegisterMode && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                  />
                  <span>Запам'ятати мене</span>
                </label>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? isRegisterMode
                  ? 'Реєстрація...'
                  : 'Вхід...'
                : isRegisterMode
                ? 'Зареєструватися'
                : 'Увійти'}
            </button>

            {error && (
              <div className="error-message" style={{ display: 'block' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="success-message" style={{ display: 'block' }}>
                {success}
              </div>
            )}
          </form>

          <div className="login-footer">
            <p>
              {isRegisterMode ? 'Вже є акаунт? ' : 'Немає акаунту? '}
              <a href="#" onClick={toggleMode}>
                {isRegisterMode ? 'Увійти' : 'Зареєструватися'}
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
