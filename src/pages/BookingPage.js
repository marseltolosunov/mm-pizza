import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTables, 
  createBooking, 
  clearBookingSuccess,
  clearError 
} from '../redux/slices/bookingSlice';

function BookingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { tables, loading, error, bookingSuccess } = useSelector((state) => state.booking);

  const [formData, setFormData] = useState({
    tableId: '',
    date: '',
    time: '',
    guests: 2,
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    eventType: 'обычный визит',
    comment: '',
  });

  const [selectedTable, setSelectedTable] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Типы мероприятий
  const eventTypes = [
    'обычный визит',
    'день рождения',
    'деловая встреча',
    'романтический ужин',
    'корпоратив',
    'семейное торжество'
  ];

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (bookingSuccess) {
      alert('🎉 Бронирование успешно создано!');
      dispatch(clearBookingSuccess());
      navigate('/my-bookings');
    }
  }, [bookingSuccess, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Очищаем ошибку для этого поля
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleTableSelect = (table) => {
    if (table.available && table.capacity >= formData.guests) {
      setSelectedTable(table);
      setFormData({
        ...formData,
        tableId: table.id,
      });
      
      // Очищаем ошибку выбора столика
      if (validationErrors.tableId) {
        setValidationErrors({
          ...validationErrors,
          tableId: ''
        });
      }
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    // Проверка имени
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Проверка телефона
    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }

    // Проверка email
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email адрес';
    }

    // Проверка даты
    if (!formData.date) {
      errors.date = 'Выберите дату бронирования';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Нельзя выбрать прошедшую дату';
      }
    }

    // Проверка времени
    if (!formData.time) {
      errors.time = 'Выберите время бронирования';
    }

    // Проверка количества гостей
    if (formData.guests < 1) {
      errors.guests = 'Количество гостей должно быть минимум 1';
    } else if (formData.guests > 20) {
      errors.guests = 'Максимум 20 гостей для онлайн бронирования';
    }

    // Проверка выбора столика
    if (!formData.tableId) {
      errors.tableId = 'Выберите столик из списка';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    dispatch(createBooking({
      ...formData,
      userId: user.id,
      userName: user.name,
      tableName: `Столик №${selectedTable.number}`,
    }));
  };

  const availableTables = tables.filter(
    table => table.available && table.capacity >= formData.guests
  );

  if (loading && tables.length === 0) {
    return <div className="loading">Загрузка столиков...</div>;
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="section-title">Бронирование столика</h1>

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        <div className="booking-content">
          {/* Форма бронирования */}
          <div className="booking-form-section">
            <h2>Детали бронирования</h2>
            
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Имя */}
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ваше имя"
                  disabled={loading}
                  className={validationErrors.name ? 'input-error' : ''}
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-row">
                {/* Дата */}
                <div className="form-group">
                  <label htmlFor="date">Дата *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={loading}
                    className={validationErrors.date ? 'input-error' : ''}
                  />
                  {validationErrors.date && (
                    <span className="error-message">{validationErrors.date}</span>
                  )}
                </div>

                {/* Время */}
                <div className="form-group">
                  <label htmlFor="time">Время *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    min="10:00"
                    max="23:00"
                    required
                    disabled={loading}
                    className={validationErrors.time ? 'input-error' : ''}
                  />
                  {validationErrors.time && (
                    <span className="error-message">{validationErrors.time}</span>
                  )}
                </div>
              </div>

              {/* Количество гостей */}
              <div className="form-group">
                <label htmlFor="guests">Количество гостей *</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  disabled={loading}
                  className={validationErrors.guests ? 'input-error' : ''}
                />
                {validationErrors.guests && (
                  <span className="error-message">{validationErrors.guests}</span>
                )}
              </div>

              {/* Тип мероприятия */}
              <div className="form-group">
                <label htmlFor="eventType">Тип мероприятия *</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Телефон */}
              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 999-99-99"
                  required
                  disabled={loading}
                  className={validationErrors.phone ? 'input-error' : ''}
                />
                {validationErrors.phone && (
                  <span className="error-message">{validationErrors.phone}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  disabled={loading}
                  className={validationErrors.email ? 'input-error' : ''}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>

              {/* Комментарий */}
              <div className="form-group">
                <label htmlFor="comment">Комментарий</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Особые пожелания..."
                  rows="3"
                  disabled={loading}
                />
              </div>

              {/* Информация о выбранном столике */}
              <div className={`selected-table-info ${validationErrors.tableId ? 'info-error' : ''}`}>
                {selectedTable ? (
                  <>
                    <strong>Выбранный столик:</strong> №{selectedTable.number} 
                    ({selectedTable.capacity} мест, {selectedTable.location})
                  </>
                ) : (
                  <span style={{color: '#e74c3c'}}>⚠ Выберите столик из списка ниже</span>
                )}
              </div>
              {validationErrors.tableId && (
                <span className="error-message">{validationErrors.tableId}</span>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-booking"
                disabled={loading}
              >
                {loading ? 'Бронирование...' : 'Забронировать'}
              </button>
            </form>
          </div>

          {/* Список столиков */}
          <div className="tables-section">
            <h2>Доступные столики ({availableTables.length})</h2>
            
            {availableTables.length === 0 ? (
              <div className="no-tables">
                <p>😔 К сожалению, нет доступных столиков на выбранное количество гостей</p>
                <p>Попробуйте изменить дату или количество гостей</p>
              </div>
            ) : (
              <div className="tables-grid">
                {availableTables.map(table => (
                  <div
                    key={table.id}
                    className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''}`}
                    onClick={() => handleTableSelect(table)}
                  >
                    <div className="table-number">Столик №{table.number}</div>
                    <div className="table-info">
                      <div className="table-capacity">
                        👥 {table.capacity} мест
                      </div>
                      <div className="table-location">
                        📍 {table.location}
                      </div>
                    </div>
                    {selectedTable?.id === table.id && (
                      <div className="table-selected-badge">✓ Выбран</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;