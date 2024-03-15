import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "64c47d47429f4c8788ffdc24",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setUserId: (state, actions) => {
      state.userId = actions.payload;
    },
  },
});

export const { setMode, setUserId } = globalSlice.actions;
export default globalSlice.reducer;
