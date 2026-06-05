import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Load user from localStorage
const loadUser = () => {
  try {
    const user = localStorage.getItem('prepai_user');
    const token = localStorage.getItem('prepai_token');
    return user && token ? { user: JSON.parse(user), token, isAuthenticated: true } : null;
  } catch { return null; }
};

const savedAuth = loadUser();

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAuthenticated: savedAuth?.isAuthenticated || false,
  loading: false,
  error: null,
};

// Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const googleLogin = createAsyncThunk('auth/google', async (credential, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/google', { credential });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Google login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('prepai_token');
      localStorage.removeItem('prepai_user');
    },
    clearError: (state) => { state.error = null; },
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('prepai_token', action.payload.token);
      localStorage.setItem('prepai_user', JSON.stringify(action.payload.user));
    };

    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, handleAuth)
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, handleAuth)
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(googleLogin.pending, (state) => { state.loading = true; })
      .addCase(googleLogin.fulfilled, handleAuth)
      .addCase(googleLogin.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        localStorage.setItem('prepai_user', JSON.stringify(payload.user));
      })

      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        localStorage.setItem('prepai_user', JSON.stringify(payload.user));
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
