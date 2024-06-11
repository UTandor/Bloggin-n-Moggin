import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  initialState: null,
  name: "notification",
  reducers: {
    notify(state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      return null;
    },
  },
});

export const { notify, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
