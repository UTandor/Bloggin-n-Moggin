import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const blogSlice = createSlice({
  initialState,
  name: "blogs",
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
