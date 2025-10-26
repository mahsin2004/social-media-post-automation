import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from '@/lib/cookies';

interface Post {
  _id: string;
  userId: string;
  title?: string;
  caption?: string;
  description?: string;
  body?: string;
  hashtags?: string[];
  platform?: string;
  imagePrompt?: string;
  imageUrl?: string | null;
  status?: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('Post list', response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

interface UpdatePostArgs {
  postId: string;
  postData: Partial<Post>;
  token: string;
}

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData, token }: UpdatePostArgs, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

interface DeletePostArgs {
  postId: string;
  token: string;
}

export const deletePost = createAsyncThunk(
    'posts/deletePost',
  async ({ postId, token }: DeletePostArgs, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default postsSlice.reducer;