import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  cancelBooking, 
  removeBooking,
  setSearchQuery,
  setSortBy 
} from '../redux/slices/bookingSlice';

function MyBookingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { bookings, loading, searchQuery, sortBy } = useSelector((state) => state.booking);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCancel = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const handleDelete = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование? Это действие нельзя отменить.')) {
      dispatch(removeBooking(bookingId));
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Фильтрация и сортировка
  const filteredAndSortedBookings = useMemo(() => {
    let userBookings = bookings.filter(booking => booking.userId === user?.id);

    // Поиск по имени
    if (searchQuery.trim() !== '') {
      userBookings = userBookings.filter(booking =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    userBookings = [...userBookings].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date); // Новые сначала
        case 'guests':
          return b.guests - a.guests; // Больше гостей сначала
        case 'name':
          return a.name.localeCompare(b.name); // По алфавиту
        default:
          return 0;
      }
    });

    return userBookings;
  }, [bookings, user, searchQuery, sortBy]);

  if (filteredAndSortedBookings.length === 0 && searchQuery === '') {
    return (
      <div className="my-bookings-empty">
        <div className="empty-content">
          <h1>📅 У вас пока нет бронирований</h1>
          <p>Забронируйте столик, чтобы насладиться нашей пиццей!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/booking')}
          >
            Забронировать столик
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="section-title">Мои бронирования ({filteredAndSortedBookings.length})</h1>

        {/* Фильтры и поиск */}
        <div className="bookings-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Найти по имени..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="sort-box">
            <label htmlFor="sortBy">Сортировать по:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="date">Дате (новые первые)</option>
              <option value="guests">Количеству гостей</option>
              <option value="name">Имени (А-Я)</option>
            </select>
          </div>
        </div>

        {filteredAndSortedBookings.length === 0 && searchQuery !== '' ? (
          <div className="no-results">
            <p>😔 Ничего не найдено по запросу "{searchQuery}"</p>
            <button 
              className="btn btn-primary"
              onClick={() => dispatch(setSearchQuery(''))}
            >
              Сбросить поиск
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredAndSortedBookings.map(booking => (
              <div 
                key={booking.id} 
                className={`booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}`}
              >
                <div className="booking-header">
                  <h3>{booking.tableName}</h3>
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status === 'confirmed' ? '✓ Подтверждено' : '✕ Отменено'}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-detail">
                    <strong>Имя:</strong> {booking.name}
                  </div>
                  <div className="booking-detail">
                    <strong>Дата:</strong> {formatDate(booking.date)}
                  </div>
                  <div className="booking-detail">
                    <strong>Время:</strong> {booking.time}
                  </div>
                  <div className="booking-detail">
                    <strong>Гостей:</strong> {booking.guests}
                  </div>
                  <div className="booking-detail">
                    <strong>Тип мероприятия:</strong> {booking.eventType}
                  </div>
                  <div className="booking-detail">
                    <strong>Телефон:</strong> {booking.phone}
                  </div>
                  <div className="booking-detail">
                    <strong>Email:</strong> {booking.email}
                  </div>
                  {booking.comment && (
                    <div className="booking-detail full-width">
                      <strong>Комментарий:</strong> {booking.comment}
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status === 'confirmed' && (
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleCancel(booking.id)}
                      disabled={loading}
                    >
                      {loading ? 'Отмена...' : 'Отменить бронь'}
                    </button>
                  )}
                  
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(booking.id)}
                    disabled={loading}
                  >
                    {loading ? 'Удаление...' : '🗑 Удалить'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;