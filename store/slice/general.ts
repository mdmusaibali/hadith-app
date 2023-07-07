import { createSlice } from "@reduxjs/toolkit";
import { getBooks, getChapters, getHadiths } from "../thunks/general";
import { Book, Chapter, Hadith } from "./../../types/general";

interface stateType {
  books: Book[];
  chapters: Chapter[];
  hadiths: Hadith[];
  isNextPageOfHadithsAvailable: Boolean | undefined;
}
const initialState: stateType = {
  books: [],
  chapters: [],
  hadiths: [],
  isNextPageOfHadithsAvailable: true,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    emptyHadiths(state) {
      state.hadiths = [];
      state.isNextPageOfHadithsAvailable = true;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getBooks.fulfilled, (state, { payload: { books } }) => {
      state.books = books;
    });
    addCase(getChapters.fulfilled, (state, { payload: { chapters } }) => {
      state.chapters = chapters;
    });
    addCase(getHadiths.fulfilled, (state, { payload: { hadiths } }) => {
      if (hadiths?.data) state.hadiths = [...state.hadiths, ...hadiths?.data];
      state.isNextPageOfHadithsAvailable = hadiths?.next_page_url;
    });
  },
});

export const generalActions = generalSlice.actions;
export const generalReducer = generalSlice.reducer;
