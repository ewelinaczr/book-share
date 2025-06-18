import { configureStore } from "@reduxjs/toolkit";
import { bookshelfApi } from "../api/bookshelfApi";

export const store = configureStore({
  reducer: {
    [bookshelfApi.reducerPath]: bookshelfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookshelfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
