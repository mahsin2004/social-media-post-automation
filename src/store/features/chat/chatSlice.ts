import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Message, Conversation } from '@/types';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId, useStreaming = true }: { message: string; sessionId: string; useStreaming?: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = useStreaming ? 'http://localhost:5000/api/chat/stream' : 'http://localhost:5000/api/chat';
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            sessionId,
            temperature: 0.7,
            maxTokens: 1024,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json();
          return rejectWithValue(error.error || 'Failed to send message');
        }

        if (useStreaming) {
          // Return only the response object for streaming, which will be handled by the component
          return {
            streaming: true,
            response
          };
        }

        const data = await response.json();
        // console.log('response----->', data.message)
        return { message: data.message, sessionId: data.sessionId };
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            return rejectWithValue('Request timed out. Please try again.');
          }
          if (error.message.includes('Failed to fetch')) {
            return rejectWithValue('Could not connect to the server. Please check your connection.');
          }
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to send message');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
    createNewConversation: (state) => {
      const newConversation: Conversation = {
        id: Math.random().toString(36).substring(2, 15),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      state.conversations.push(newConversation);
      state.currentConversationId = newConversation.id;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const conversation = state.conversations.find(conv => conv.id === action.payload.conversationId);
      if (conversation) {
        conversation.messages.push(action.payload.message);
      }
    },
    updateStreamingMessage: (state, action: PayloadAction<{ conversationId: string; content: string }>) => {
      const conversation = state.conversations.find(conv => conv.id === action.payload.conversationId);
      if (conversation) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = action.payload.content;
        } else {
          conversation.messages.push({
            role: 'assistant',
            content: action.payload.content,
          });
        }
      }
    },
    clearConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(conv => conv.id !== action.payload);
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentConversationId,
  createNewConversation,
  addMessage,
  updateStreamingMessage,
  clearConversation,
} = chatSlice.actions;

export default chatSlice.reducer;