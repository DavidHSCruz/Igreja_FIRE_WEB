import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { User } from "../../types/User";

export type AuthState = {
  user: User | null;
  token: string | null;
  bootstrapping: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  bootstrapping: true,
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  user: User;
};

export const hydrateAuthFromStorage = createAsyncThunk(
  "auth/hydrate",
  async () => {
    try {
      const recoveredUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!recoveredUser || !token) {
        return { user: null, token: null } as const;
      }

      const user = JSON.parse(recoveredUser) as User;
      return { user, token } as const;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { user: null, token: null } as const;
    }
  },
);

export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    const { access_token, user } = response.data;

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return { token: access_token, user } as const;
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

export const refreshUser = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState } }
>("auth/refreshUser", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const currentUser =
      auth.user ||
      (localStorage.getItem("user")
        ? (JSON.parse(localStorage.getItem("user")!) as User)
        : null);

    if (!currentUser?.id) {
      return rejectWithValue(null);
    }

    const response = await api.get<User>(
      `/users/${currentUser.id}/complete-profile`,
    );
    const updatedUser = response.data;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return rejectWithValue(null);
  }
});

export const updateUserAndPersist = createAsyncThunk(
  "auth/updateUserAndPersist",
  async (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.bootstrapping = false;
      })
      .addCase(hydrateAuthFromStorage.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.bootstrapping = false;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserAndPersist.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setCredentials, updateUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
