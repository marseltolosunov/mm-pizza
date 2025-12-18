import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tablesData from '../../data/tables.json';

// Загрузка из localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('bookings');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

// Сохранение в localStorage
const saveToLocalStorage = (bookings) => {
  try {
    const serializedState = JSON.stringify(bookings);
    localStorage.setItem('bookings', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

// Имитация API запроса для получения столиков
export const fetchTables = createAsyncThunk(
  'booking/fetchTables',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return tablesData;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить столики');
    }
  }
);

// Имитация API запроса для создания бронирования
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isAvailable = Math.random() > 0.1;
      
      if (!isAvailable) {
        throw new Error('К сожалению, этот столик уже забронирован');
      }

      const booking = {
        id: Date.now(),
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      return booking;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Удаление бронирования
export const removeBooking = createAsyncThunk(
  'booking/removeBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return bookingId;
    } catch (error) {
      return rejectWithValue('Не удалось удалить бронирование');
    }
  }
);

// Отмена бронирования
export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return bookingId;
    } catch (error) {
      return rejectWithValue('Не удалось отменить бронирование');
    }
  }
);

const initialState = {
  tables: [],
  bookings: loadFromLocalStorage(), // Загружаем из localStorage
  loading: false,
  error: null,
  bookingSuccess: false,
  searchQuery: '',
  sortBy: 'date', // 'date', 'guests', 'name'
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tables
    builder.addCase(fetchTables.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTables.fulfilled, (state, action) => {
      state.loading = false;
      state.tables = action.payload;
    });
    builder.addCase(fetchTables.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Booking
    builder.addCase(createBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.bookingSuccess = false;
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings.push(action.payload);
      state.bookingSuccess = true;
      
      // Сохраняем в localStorage
      saveToLocalStorage(state.bookings);
      
      const table = state.tables.find(t => t.id === action.payload.tableId);
      if (table) {
        table.available = false;
      }
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.bookingSuccess = false;
    });

    // Remove Booking (полное удаление)
    builder.addCase(removeBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeBooking.fulfilled, (state, action) => {
      state.loading = false;
      const bookingIndex = state.bookings.findIndex(b => b.id === action.payload);
      
      if (bookingIndex !== -1) {
        const booking = state.bookings[bookingIndex];
        
        // Освобождаем столик
        const table = state.tables.find(t => t.id === booking.tableId);
        if (table) {
          table.available = true;
        }
        
        // Удаляем бронирование
        state.bookings.splice(bookingIndex, 1);
        
        // Сохраняем в localStorage
        saveToLocalStorage(state.bookings);
      }
    });
    builder.addCase(removeBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Cancel Booking
    builder.addCase(cancelBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cancelBooking.fulfilled, (state, action) => {
      state.loading = false;
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
        
        const table = state.tables.find(t => t.id === booking.tableId);
        if (table) {
          table.available = true;
        }
        
        // Сохраняем в localStorage
        saveToLocalStorage(state.bookings);
      }
    });
    builder.addCase(cancelBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { 
  clearBookingSuccess, 
  clearError, 
  setSearchQuery, 
  setSortBy 
} = bookingSlice.actions;

export default bookingSlice.reducer;