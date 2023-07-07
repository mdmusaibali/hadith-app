import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY } from "@env";

declare var process: {
  env: {
    API_KEY: string;
  };
};

export const getBooks = createAsyncThunk(
  "getBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://hadithapi.com/api/books?apiKey=${
          API_KEY || process.env.API_KEY
        }`
      );
      const data = response.data;
      return { books: data?.books };
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

export const getChapters = createAsyncThunk(
  "getChapters",
  async (payload: { bookSlug: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://hadithapi.com/api/${payload.bookSlug}/chapters?apiKey=${
          API_KEY || process.env.API_KEY
        }`
      );
      const data = response.data;
      return { chapters: data?.chapters };
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

interface getHadithsPayload {
  bookSlug: string;
  pageNumber: string;
  chapterNumber: string;
}
export const getHadiths = createAsyncThunk(
  "getHadiths",
  async (payload: getHadithsPayload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://hadithapi.com/api/hadiths/?apiKey=${
          API_KEY || process.env.API_KEY
        }&page=${payload.pageNumber}&book=sahih-bukhari&chapter=${
          payload.chapterNumber
        }`
      );
      const data = response.data;
      return { hadiths: data?.hadiths };
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);
