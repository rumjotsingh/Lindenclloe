import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connection } from "next/server";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        ThunkAPI.rejectWithValue({ message: "token not provided" });
      }
      return ThunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, ThunkAPI) => {
    try {
      const request = await clientServer.post("/register", {
        username: user.username,
        email: user.email,
        name: user.name,
        password: user.password,
      });
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const sendConnectionRequset = createAsyncThunk(
  "user/sendConnectionRequset",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );
      ThunkAPI.dispatch(getConnectionsReques({ token: user.token }));

      return ThunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_connection_request", {
        params: {
          token: user.token,
        },
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const getMyConnectionRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/user_connnection_request",
        {
          params: {
            token: user.token,
          },
        }
      );
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const AcceptConnection = createAsyncThunk(
  "user/AcceptConnection",
  async (user, ThunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connnection/request",
        {
          token: user.token,
          requestId: user.requestId,
          action_type: user.action_type,
        }
      );
      ThunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      ThunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
