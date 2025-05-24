import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "system", // Or 'light', 'dark' depending on your default
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      // You might want to persist the theme to localStorage here
      // and apply it to the document body (e.g., by adding/removing a 'dark' class)
      if (action.payload === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else if (action.payload === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        localStorage.removeItem("theme"); // For 'system'
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    // Optional: action to initialize theme from localStorage or system preference
    initializeTheme: (state) => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        state.theme = storedTheme;
        if (storedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // If no theme in localStorage, use system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
          state.theme = "dark"; // Reflect system preference in state
        } else {
          document.documentElement.classList.remove("dark");
          state.theme = "light"; // Reflect system preference in state
        }
        // If you truly want 'system' as a distinct state that doesn't resolve to light/dark immediately
        // in the JS, you'd adjust the logic here. For now, it resolves to light/dark.
      }
    },
  },
});

export const { setTheme, initializeTheme } = themeSlice.actions;

export const selectTheme = (state: any) => state.theme.theme;

export default themeSlice.reducer;
