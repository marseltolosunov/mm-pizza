import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import './styles/App.css';
import HomePage from './pages/HomePage';
import PizzaDetailPage from './pages/PizzaDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div className="App">
        {/* Шапка сайта */}
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo" style={{textDecoration: 'none', color: 'white'}}>
              M&M Pizza
            </Link>
            <nav className="nav">
              <Link to="/">Главная</Link>
              <Link to="/booking">Бронирование</Link>
              <Link to="/favorites" className="favorites-link">
                Избранное 
                {favorites.length > 0 && (
                  <span className="favorites-badge">{favorites.length}</span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/my-bookings">Мои брони</Link>
                  <span className="user-info">Привет, {user?.name}!</span>
                  <button onClick={handleLogout} className="btn-logout">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Вход</Link>
                  <Link to="/register">Регистрация</Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Основной контент */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pizza/:id" element={<PizzaDetailPage />} />
            <Route 
              path="/favorites" 
              element={
                isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/booking" 
              element={
                isAuthenticated ? <BookingPage /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/my-bookings" 
              element={
                isAuthenticated ? <MyBookingsPage /> : <Navigate to="/login" />
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>

        {/* Подвал */}
        <footer className="footer">
          <p>© 2025 M&M Pizza. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;