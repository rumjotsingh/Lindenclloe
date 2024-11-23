import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (posts, ThunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, ThunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);
      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return ThunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        ThunkAPI.rejectWithValue("post was not uploaded");
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, ThunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id,
        },
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const increamentLikes = createAsyncThunk(
  "post/increamentLikes",
  async (post, ThunkAPI) => {
    try {
      const response = await clientServer.post("/increment_likes", {
        post_id: post.post_id,
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const decreamentLikes = createAsyncThunk(
  "post/decreamentLikes",
  async (post, ThunkAPI) => {
    try {
      const response = await clientServer.post("/decreament_likes", {
        post_id: post.post_id,
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getCommnets = createAsyncThunk(
  "post/getAllComments",
  async (postData, ThunkAPI) => {
    try {
      const response = await clientServer.get("/get_comment", {
        params: {
          post_id: postData.post_id,
        },
      });
      return ThunkAPI.fulfillWithValue({
        commnets: response.data,
        post_id: postData.post_id,
      });
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const postCommnet = createAsyncThunk(
  "post/postComment",
  async (commentData, ThunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
