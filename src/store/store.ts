import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { bookshelfApi } from "../api/bookshelfApi";
import { marketApi } from "@/api/marketApi";
import { chatApi } from "@/api/chatApi";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookshelfApi.reducerPath]: bookshelfApi.reducer,
    [marketApi.reducerPath]: marketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      bookshelfApi.middleware,
      marketApi.middleware,
      chatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
