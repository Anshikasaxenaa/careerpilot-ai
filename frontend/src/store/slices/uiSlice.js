import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    theme: 'dark',
    isMobile: false,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebar: (state, { payload }) => { state.sidebarOpen = payload; },
    setMobile: (state, { payload }) => { state.isMobile = payload; },
  },
});

export const { toggleSidebar, setSidebar, setMobile } = uiSlice.actions;
export default uiSlice.reducer;