import { createSlice } from "@reduxjs/toolkit";

interface Search {
  query: string;
}

const initialState: Search = {
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // search: (state, action) => {
    //   state.search = action.payload;
    // },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;

export default searchSlice.reducer;
