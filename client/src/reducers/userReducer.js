import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  initialState: null,
  name: "user",
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser(state, action) {
      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
