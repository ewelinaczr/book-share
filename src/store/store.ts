import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { bookshelfApi } from "../api/bookshelfApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [bookshelfApi.reducerPath]: bookshelfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, bookshelfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
