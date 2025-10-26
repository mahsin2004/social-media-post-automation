import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chat/chatSlice';
import postsReducer from './features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;