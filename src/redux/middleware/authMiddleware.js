import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
} from '../slices/authSlice';

// Action types для middleware
export const REGISTER_USER = 'auth/registerUser';
export const LOGIN_USER = 'auth/loginUser';

// Middleware для обработки регистрации и авторизации
export const authMiddleware = (store) => (next) => (action) => {
  if (action.type === REGISTER_USER) {
    const { email, password, name } = action.payload;
    
    // Запускаем процесс регистрации
    store.dispatch(registerStart());

    // Имитация асинхронного запроса к серверу
    setTimeout(() => {
      const state = store.getState();
      const existingUser = state.auth.users.find(user => user.email === email);

      if (existingUser) {
        store.dispatch(registerFailure('Пользователь с таким email уже существует'));
      } else {
        // Создаем нового пользователя
        const newUser = {
          id: Date.now(),
          email,
          name,
          password, // В реальном проекте пароль должен быть захеширован!
          createdAt: new Date().toISOString(),
        };

        store.dispatch(registerSuccess(newUser));
        
        // Автоматически авторизуем после регистрации
        store.dispatch(loginSuccess({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        }));
      }
    }, 1500);

    return next(action);
  }

  if (action.type === LOGIN_USER) {
    const { email, password } = action.payload;
    
    // Запускаем процесс входа
    store.dispatch(loginStart());

    // Имитация асинхронного запроса к серверу
    setTimeout(() => {
      const state = store.getState();
      const user = state.auth.users.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        store.dispatch(loginSuccess({
          id: user.id,
          email: user.email,
          name: user.name,
        }));
      } else {
        store.dispatch(loginFailure('Неверный email или пароль'));
      }
    }, 1500);

    return next(action);
  }

  return next(action);
};