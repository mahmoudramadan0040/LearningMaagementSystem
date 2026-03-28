import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocaleState {
  locale: string;
}

const initialState: LocaleState = {
  locale: "en", // default language
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
    },
    toggleLocale: (state) => {
      state.locale = state.locale === "en" ? "ar" : "en";
    },
  },
});

export const { setLocale, toggleLocale } = localeSlice.actions;
export default localeSlice.reducer;