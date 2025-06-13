import { createSlice } from "@reduxjs/toolkit";

interface Search {
  search: string | null;
}

const initialState: Search = {
  search: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    search: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { search } = searchSlice.actions;

export default searchSlice.reducer;
