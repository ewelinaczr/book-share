import { configureStore } from "@reduxjs/toolkit";
import { bookshelfApi } from "../api/bookshelfApi";
import { marketApi } from "@/api/marketApi";

export const store = configureStore({
  reducer: {
    [bookshelfApi.reducerPath]: bookshelfApi.reducer,
    [marketApi.reducerPath]: marketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookshelfApi.middleware,
      marketApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
