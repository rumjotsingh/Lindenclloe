import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionRequest,
  loginUser,
  registerUser,
} from "../../action/authAction";
import { act } from "react";

const initialState = {
  user: undefined,
  isError: false,
  isSucess: false,
  isLoading: false,
  loggedin: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connection: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking The door ...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSucess = true),
          (state.loggedin = true),
          (state.message = "Login is Sucessful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Registering the User";
      })
      .addCase(registerUser.fulfilled, (state) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSucess = true),
          (state.loggedin = true),
          (state.message = {
            message: "Registeration is Sucessful,Please Login",
          });
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.profileFetched = true),
          (state.user = action.payload.profile);
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        (state.all_profiles_fetched = true),
          (state.isLoading = false),
          (state.isError = false),
          (state.all_users = action.payload.profiles);
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connection = action.payload.connections;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.connectionRequest = action.payload.connections;
      })
      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});
export const { reset, emptyMessage, setTokenThere, setTokenIsNotThere } =
  authSlice.actions;
export default authSlice.reducer;
