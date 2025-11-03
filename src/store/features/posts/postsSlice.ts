import { createSlice, createAsyncThunk, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import type { RootState } from '../../index';
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

const postsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
} = postsAdapter.getSelectors((state: RootState) => state.posts as EntityState<Post, string>);

interface PostsState extends EntityState<Post, string> {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PostsState = postsAdapter.getInitialState({
  isLoading: false,
  error: null,
  lastFetched: null,
});

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (arg: { forceRefetch?: boolean } = {}, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { lastFetched, isLoading } = state.posts;

    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = Date.now();

    if (!arg.forceRefetch && lastFetched && (now - lastFetched < fiveMinutes || isLoading)) {
      return rejectWithValue('Posts already fetched recently.');
    }

    try {
      const token = getAuthToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        postsAdapter.setAll(state, action.payload);
        state.lastFetched = Date.now();
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
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.meta.arg.postId);
      });
  },
});

export default postsSlice.reducer;