import { createSlice } from '@reduxjs/toolkit';

// Загрузка из localStorage
const loadUsersFromLocalStorage = () => {
  try {
    const serializedUsers = localStorage.getItem('users');
    if (serializedUsers === null) {
      return [];
    }
    return JSON.parse(serializedUsers);
  } catch (err) {
    return [];
  }
};

const loadCurrentUserFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem('currentUser');
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (err) {
    return null;
  }
};

// Сохранение в localStorage
const saveUsersToLocalStorage = (users) => {
  try {
    const serializedUsers = JSON.stringify(users);
    localStorage.setItem('users', serializedUsers);
  } catch (err) {
    console.error('Could not save users', err);
  }
};

const saveCurrentUserToLocalStorage = (user) => {
  try {
    if (user) {
      const serializedUser = JSON.stringify(user);
      localStorage.setItem('currentUser', serializedUser);
    } else {
      localStorage.removeItem('currentUser');
    }
  } catch (err) {
    console.error('Could not save current user', err);
  }
};

const currentUser = loadCurrentUserFromLocalStorage();

const initialState = {
  user: currentUser,
  isAuthenticated: currentUser !== null,
  loading: false,
  error: null,
  users: loadUsersFromLocalStorage(), // Загружаем пользователей из localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
      state.error = null;
      
      // Сохраняем в localStorage
      saveUsersToLocalStorage(state.users);
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      
      // Сохраняем текущего пользователя
      saveCurrentUserToLocalStorage(action.payload);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      
      // Удаляем текущего пользователя из localStorage
      saveCurrentUserToLocalStorage(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;