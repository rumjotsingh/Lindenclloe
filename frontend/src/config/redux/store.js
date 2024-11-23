import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

/**
 * Steps top follow the state managements
 * Submit Action
 * HANDLE THE ACTION IN ITS REDUCER
 * REGISTER HERE->REDUCER
 * **/
