
import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    currentInterview: null,
    currentQuestionIndex: 0,
    answers: {},
    timeLeft: 0,
    isTimerRunning: false,
    loading: false,
  },
  reducers: {
    setCurrentInterview: (state, { payload }) => { state.currentInterview = payload; state.currentQuestionIndex = 0; state.answers = {}; },
    setQuestionIndex: (state, { payload }) => { state.currentQuestionIndex = payload; },
    saveAnswer: (state, { payload }) => { state.answers[payload.index] = payload.answer; },
    setTimer: (state, { payload }) => { state.timeLeft = payload; },
    toggleTimer: (state) => { state.isTimerRunning = !state.isTimerRunning; },
    decrementTimer: (state) => { if (state.timeLeft > 0) state.timeLeft -= 1; },
    setLoading: (state, { payload }) => { state.loading = payload; },
    resetInterview: (state) => { state.currentInterview = null; state.currentQuestionIndex = 0; state.answers = {}; state.timeLeft = 0; state.isTimerRunning = false; },
  },
});

export const { setCurrentInterview, setQuestionIndex, saveAnswer, setTimer, toggleTimer, decrementTimer, setLoading, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
