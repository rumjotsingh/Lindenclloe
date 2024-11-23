import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getCommnets } from "../../action/postAction";

const initialState = {
  all_posts: [],
  isError: false,
  isLoading: false,
  postFetched: false,
  loggedin: false,
  message: "",
  comments: [], // Fixed typo here from "commnets" to "comments"
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.message = "Fetching All the Posts";
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.postFetched = true;
        state.isLoading = false;
        state.isError = false;
        state.all_posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCommnets.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.commnets;
      });
  },
});
export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;
